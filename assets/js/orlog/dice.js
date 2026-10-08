import * as THREE from "three"
import * as CANNON from "cannon-es"
import { RoundedBoxGeometry } from "../../vendor/three/RoundedBoxGeometry.js"
import { faceTexture } from "./textures"

export const DICE_SIZE = 4
const geometry = new RoundedBoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE, 3, 0.55)

// Box groups are ordered +x, -x, +y, -y, +z, -z. Whichever face lands on top carries the
// rolled result; the other five are decoration, so a tumbling die shows a mix of symbols.
const DECOR_FACES = [
  { type: "melee", stance: "attack", tokens: false },
  { type: "ranged", stance: "block", tokens: false },
  { type: "ranged", stance: "attack", tokens: true },
  { type: "melee", stance: "block", tokens: true },
  { type: "token", stance: "steal", tokens: false },
  { type: "melee", stance: "attack", tokens: true }
]

// [normal, texture right, texture up] of each box group in the die's local frame
const FACE_FRAMES = [
  [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
  [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[0, 1, 0], [1, 0, 0], [0, 0, -1]],
  [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
  [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
  [[0, 0, -1], [-1, 0, 0], [0, 1, 0]]
].map(frame => frame.map(v => new THREE.Vector3(...v)))
const NORMALS = FACE_FRAMES.map(([normal]) => normal)

// Rotation that turns a face up with its symbol facing the player, like the +y face unrotated
const SLOT_UP = FACE_FRAMES.map(([normal, right, up]) => {
  const basis = new THREE.Matrix4().makeBasis(right, normal, up.clone().negate())
  return new THREE.Quaternion().setFromRotationMatrix(basis).invert()
})
const DEFAULT_TOP = 2

const GRAVITY = -80
const BOWL_RADIUS = 9.2
const STEP = 1 / 60
const MAX_SIM_TIME = 4.5
const MAX_NUDGES = 2
const MIN_SIM_TIME = 0.6
const LAND_BLEND = 0.3
const PLAYBACK_SPEED = 1.4
const THROW_ATTEMPTS = 4
// a die leaning on a neighbour still counts as landed, it is laid flat at the end
const FLAT_COS = Math.cos((25 * Math.PI) / 180)
const FLOOR_SLACK = 1
const DICE_GAP = DICE_SIZE * 1.15

// A die marked to keep moves out of the bowl into a column beside it (seat-local
// coordinates, between the bowl and the favor plaques)
const STAGE_X = 13.8
const STAGE_Z = 10.5

const COMMIT_STAGGER = 0.12
const REORDER_STAGGER = 0.08

const UP = new THREE.Vector3(0, 1, 0)

const hash = id => {
  let h = 2166136261
  for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
  return (h ^ (h >>> 16)) >>> 0
}
const jitter = (id, salt, amount) => (((hash(id) * (salt + 3)) % 1000) / 1000 - 0.5) * 2 * amount

export const easeOut = t => 1 - Math.pow(1 - t, 3)
export const easeIn = t => t * t
export const easeInOut = t => t * t * (3 - 2 * t)

/**
 * Keyframes for lifting a die, carrying it over to `to` and setting it down.
 * Every keyframe is {pos?, quat?, scale?, duration, delay?, ease?}, see Die#animate.
 */
export function arc(from, to, quat, scale, { delay = 0, height = 4, travel = 0.4 } = {}) {
  const lift = from.clone()
  lift.y = Math.max(from.y, to.y) + height
  const over = to.clone()
  over.y += height
  return [
    { pos: lift, duration: 0.14, delay, ease: easeOut },
    { pos: over, quat, scale, duration: travel, ease: easeInOut },
    { pos: to.clone(), quat, scale, duration: 0.14, ease: easeIn }
  ]
}

/** A small hop in place, for dice that keep their spot while their neighbours move. */
export function hop(pos, quat, scale, { delay = 0, height = 0.9 } = {}) {
  const top = pos.clone()
  top.y += height
  return [
    { pos: top, duration: 0.1, delay, ease: easeOut },
    { pos: pos.clone(), quat, scale, duration: 0.14, ease: easeIn }
  ]
}

class Die {
  constructor(id, seat) {
    this.id = id
    this.seat = seat
    this.mode = "rest" // rest | row | tumble | script
    this.place = null // where the die lives logically: "bowl" | "stage" | "row"
    this.look = ""
    this.hover = false
    this.dim = false
    this.spent = false
    this.keep = false
    this.clickable = false
    this.glow = null // { color, until }
    this.script = null

    this.materials = Array.from(
      { length: 6 },
      () =>
        new THREE.MeshStandardMaterial({
          roughness: 0.55,
          metalness: 0,
          emissive: 0x000000
        })
    )
    this.decor = DECOR_FACES.map((face, i) => [hash(`${id}-${i}`), face])
      .sort((a, b) => a[0] - b[0])
      .map(([, face]) => faceTexture({ ...face, disabled: false }))
    this.decor.forEach((texture, slot) => (this.materials[slot].map = texture))

    this.mesh = new THREE.Mesh(geometry, this.materials)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.userData = { kind: "die", seat: seat.name, id }

    this.target = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1 }
    this.topSlot = DEFAULT_TOP
    this.restYaw = jitter(id, 1, 0.5)
    this.restSpot = null
    this.restQuat = null
    this.track = null
    this.mesh.position.set(0, -10, 0)
    this.snap = true
  }

  /** Put the rolled face on `topSlot` and decoration everywhere else; no result shows decoration only. */
  paint(face, tokens) {
    const key = face ? `${this.topSlot}-${face.type}-${face.stance}-${tokens > 0}-${face.disabled}` : "decor"
    if (key === this.faceKey) return
    this.faceKey = key
    this.materials.forEach((material, slot) => {
      material.map =
        face && slot === this.topSlot
          ? faceTexture({
              type: face.type,
              stance: face.stance,
              tokens: tokens > 0,
              disabled: face.disabled
            })
          : this.decor[slot]
    })
  }

  /** Resting pose with the top face up, turned by `yaw` around the vertical. */
  pose(yaw) {
    return new THREE.Quaternion().setFromAxisAngle(UP, yaw).multiply(SLOT_UP[this.topSlot])
  }

  /** Shade the die: dimmed when locked or spent, amber pulse when kept, bright on hover or effects. */
  applyLook(now) {
    const glowing = this.glow && this.glow.until > now ? this.glow : null
    const pulsing = this.keep && !this.dim
    const key = `${this.dim}-${this.spent}-${this.hover}-${this.keep}-${glowing ? glowing.color : ""}`
    if (key === this.look && !glowing && !pulsing) return
    this.look = key

    const shade = this.dim || this.spent ? 0.74 : 1
    const emissive = new THREE.Color(0x000000)
    if (pulsing) emissive.setHex(0x3a2408).multiplyScalar(1.1 + 0.5 * Math.sin(now * 5))
    if (this.hover && this.clickable) emissive.setHex(0x5c4a22)
    if (glowing) {
      const pulse = 0.5 + 0.5 * Math.sin(now * 14)
      emissive.set(glowing.color).multiplyScalar(0.35 + 0.35 * pulse)
    }
    this.materials.forEach(material => {
      material.color.setScalar(shade)
      material.emissive.copy(emissive)
    })
  }

  moveTo(pos, quat, scale) {
    this.target.pos.copy(pos)
    this.target.quat.copy(quat)
    this.target.scale = scale
  }

  /**
   * Play keyframes starting from wherever the die is now. Afterwards the die hands back to
   * following its target, so the last keyframe should be the target pose.
   * Options: tag (see DiceSet#finishAll), onDone.
   */
  animate(steps, { tag = null, onDone = null } = {}) {
    this.mode = "script"
    this.script = {
      steps,
      i: 0,
      t: 0,
      tag,
      onDone,
      from: {
        pos: this.mesh.position.clone(),
        quat: this.mesh.quaternion.clone(),
        scale: this.mesh.scale.x
      }
    }
  }

  advance(dt) {
    const script = this.script
    script.t += dt

    while (script.i < script.steps.length) {
      const step = script.steps[script.i]
      const delay = step.delay ?? 0
      const duration = Math.max(step.duration ?? 0.2, 0.0001)

      if (script.t < delay + duration) {
        const p = Math.max(0, (script.t - delay) / duration)
        const eased = (step.ease ?? easeInOut)(p)
        const { from } = script
        this.mesh.position.lerpVectors(from.pos, step.pos ?? from.pos, eased)
        this.mesh.quaternion.slerpQuaternions(from.quat, step.quat ?? from.quat, eased)
        this.mesh.scale.setScalar(from.scale + ((step.scale ?? from.scale) - from.scale) * eased)
        return
      }

      script.t -= delay + duration
      script.from = {
        pos: (step.pos ?? script.from.pos).clone(),
        quat: (step.quat ?? script.from.quat).clone(),
        scale: step.scale ?? script.from.scale
      }
      script.i++
    }

    const { from, onDone } = script
    this.mesh.position.copy(from.pos)
    this.mesh.quaternion.copy(from.quat)
    this.mesh.scale.setScalar(from.scale)
    this.script = null
    this.mode = this.place === "bowl" ? "rest" : "row"
    onDone?.()
  }

  /** Jump to the end of the running script. */
  finish() {
    if (!this.script) return
    this.script.t = Infinity
    this.advance(0)
  }

  /** Ease towards the target pose. */
  follow(k) {
    const { mesh, target } = this
    mesh.position.lerp(target.pos, k)
    mesh.quaternion.slerp(target.quat, k)
    mesh.scale.setScalar(mesh.scale.x + (target.scale - mesh.scale.x) * k)
  }
}

/**
 * The dice of one player: tumbling in the bowl, resting in it, or lined up in the row
 * between the bowls. Coordinates are local to the player's seat (+z is towards the player).
 */
export class DiceSet {
  constructor(parent, seat) {
    this.parent = parent
    this.seat = seat // { name, side, bowl: Vector3, rowZ }
    this.dice = new Map()
    this.prevRolled = null
    this.rowKind = null // "roll" | "faceoff", the layout the row was last placed for
    this.lockOrder = [] // ids in the order they were committed to the row
    this.stageOrder = [] // ids in the order they were picked to keep
    this.time = 0
  }

  /** A physics world holding just the bowl, for simulating one throw. */
  bowlWorld() {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, GRAVITY, 0) })
    world.allowSleep = true
    world.defaultContactMaterial.restitution = 0.35
    world.defaultContactMaterial.friction = 0.35

    const { bowl } = this.seat
    const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() })
    floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    floor.position.set(0, bowl.y, 0)
    world.addBody(floor)

    const walls = 20
    for (let i = 0; i < walls; i++) {
      const theta = (i / walls) * Math.PI * 2
      const wall = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(2.4, 20, 0.6))
      })
      wall.position.set(
        bowl.x + Math.cos(theta) * (BOWL_RADIUS + 0.6),
        bowl.y + 20,
        bowl.z + Math.sin(theta) * (BOWL_RADIUS + 0.6)
      )
      wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2 - theta)
      world.addBody(wall)
    }
    return world
  }

  meshes() {
    return [...this.dice.values()].map(die => die.mesh)
  }

  get(id) {
    return this.dice.get(id)
  }

  /** Spots inside the bowl where resting dice end up. */
  restSpot(index, count) {
    const { bowl } = this.seat
    const spot = new THREE.Vector3(bowl.x, bowl.y + DICE_SIZE / 2 + 0.02, bowl.z)
    if (count <= 1) return spot

    const ringCount = count <= 6 ? count : count - 1
    const radius = count <= 6 ? 4.4 : 6
    const i = count <= 6 ? index : index - 1
    if (count > 6 && index === 0) return spot

    const angle = (i / ringCount) * Math.PI * 2 + 0.5
    spot.x += Math.cos(angle) * radius
    spot.z += Math.sin(angle) * radius
    return spot
  }

  /**
   * Entries in the order they entered a zone (the row or the stage); new ones are appended
   * and the ones that left are forgotten. `name` is the list that remembers the order.
   */
  keepOrder(name, entries) {
    const ids = new Set(entries.map(entry => entry.id))
    this[name] = this[name].filter(id => ids.has(id))
    for (const entry of entries) if (!this[name].includes(entry.id)) this[name].push(entry.id)
    return this[name].map(id => entries.find(entry => entry.id === id))
  }

  /** Spot `index` in the column beside the bowl where dice marked to keep wait. */
  stageSlot(index, total) {
    const spacing = Math.min(4.8, 24 / Math.max(total, 1))
    const scale = Math.min(1, spacing / 4.9)
    return {
      scale,
      pos: new THREE.Vector3(
        STAGE_X,
        (DICE_SIZE * scale) / 2 + 0.02,
        STAGE_Z + index * spacing
      )
    }
  }

  /**
   * @param layout {kind, row, stage, bowl} from state.layoutDice
   * @param ctx {rolled, fresh, dimLocked, clickable: entry => boolean}
   */
  sync(layout, ctx) {
    const { kind, bowl } = layout
    const row = kind === "roll" ? this.keepOrder("lockOrder", layout.row) : layout.row
    const stage = this.keepOrder("stageOrder", layout.stage)
    const justRolled = this.prevRolled === false && ctx.rolled === true
    this.prevRolled = ctx.rolled

    const wanted = new Set([...row, ...stage, ...bowl].filter(e => !e.placeholder).map(e => e.id))
    for (const [id, die] of this.dice) {
      if (!wanted.has(id)) {
        this.parent.remove(die.mesh)
        die.materials.forEach(m => m.dispose())
        this.dice.delete(id)
      }
    }

    const ensure = id => {
      let die = this.dice.get(id)
      if (!die) {
        die = new Die(id, this.seat)
        this.dice.set(id, die)
        this.parent.add(die.mesh)
      }
      return die
    }

    // --- the row: fixed slots, the same left to right on screen for both players. While
    // rolling there is one slot per die, so dice never shift when another one joins.
    const reorder = this.rowKind !== null && this.rowKind !== kind
    this.rowKind = kind

    const total = row.length + stage.length + bowl.length
    const slots = kind === "roll" ? total : row.length
    const spacing = Math.min(5.3, 56 / Math.max(slots, 1))
    const scale = Math.min(1, spacing / 4.9)
    const arrivals = []

    row.forEach((entry, i) => {
      if (entry.placeholder) return
      const die = ensure(entry.id)
      const pos = new THREE.Vector3(
        this.seat.side * (i - (slots - 1) / 2) * spacing,
        (DICE_SIZE * scale) / 2 + 0.02,
        this.seat.rowZ
      )
      const quat = die.pose(jitter(entry.id, 2, 0.06))
      this.decorate(die, entry, false, ctx)

      const arrived = die.place === "row" && die.target.pos.distanceTo(pos) < 0.01
      if (die.snap || (arrived && !reorder)) {
        // new, or already in its slot: nothing to animate
        die.place = "row"
        if (die.mode === "rest" || die.mode === "init") die.mode = "row"
        die.moveTo(pos, quat, scale)
      } else {
        arrivals.push({ die, pos, quat, scale, moved: !arrived })
      }
    })

    this.place(arrivals, "row", reorder)

    // --- the stage: dice marked to keep wait in a column beside the bowl, in the order
    // they were picked; when one is put back the ones after it move up
    const staged = []
    stage.forEach((entry, i) => {
      const die = ensure(entry.id)
      const { pos, scale: stageScale } = this.stageSlot(i, total)
      const quat = die.pose(die.restYaw)
      this.decorate(die, entry, false, ctx)

      if (die.snap || (die.place === "stage" && die.target.pos.distanceTo(pos) < 0.01)) {
        die.place = "stage"
        if (die.mode === "rest") die.mode = "row"
        die.moveTo(pos, quat, stageScale)
      } else {
        staged.push({ die, pos, quat, scale: stageScale, moved: true })
      }
    })

    this.place(staged, "stage")

    // --- the bowl: dice stay where they landed until the next throw
    if (justRolled) this.throwAll(bowl.map(entry => ensure(entry.id)))

    const comeBack = []
    bowl.forEach((entry, i) => {
      const die = ensure(entry.id)
      const spot = this.restSpot(i, bowl.length)
      this.decorate(die, entry, ctx.fresh, ctx)

      if (justRolled) {
        die.place = "bowl"
      } else if (die.place !== "bowl" && !die.snap) {
        comeBack.push({ die, spot })
      } else if (die.snap || !die.restSpot) {
        die.place = "bowl"
        die.mode = "rest"
        die.restSpot = spot
        die.restQuat = die.pose(die.restYaw)
        die.moveTo(spot, die.restQuat, 1)
      } else if (die.mode === "rest") {
        die.moveTo(die.restSpot, die.restQuat, 1)
      }
    })

    // A die put back from the stage returns to the spot where it landed. When the dice come
    // back from the row (a new round) the bowl is laid out afresh, one after another.
    let fromRow = 0
    comeBack.forEach(({ die, spot }) => {
      const fromStage = die.place === "stage" && die.restSpot
      const target = fromStage ? die.restSpot : spot
      const quat = fromStage ? die.restQuat : die.pose(die.restYaw)
      const delay = fromStage ? 0 : fromRow++ * COMMIT_STAGGER

      die.place = "bowl"
      die.restSpot = target
      die.restQuat = quat
      die.moveTo(target, quat, 1)
      die.animate(
        arc(die.mesh.position, target, quat, 1, {
          delay,
          height: fromStage ? 3 : 5,
          travel: fromStage ? 0.3 : 0.45
        })
      )
    })

    // Dice that just appeared don't fly in from the void
    for (const die of this.dice.values()) {
      if (die.snap) {
        die.mesh.position.copy(die.target.pos)
        die.mesh.quaternion.copy(die.target.quat)
        die.mesh.scale.setScalar(die.target.scale)
        die.snap = false
      }
    }
  }

  /**
   * Move dice into their slots in the row or on the stage. Dice committed to the row go
   * one after another in commit order; when the row is rearranged for the face-off the
   * dice with the furthest to go move first, and dice that stay put hop in place. Dice
   * picked for the stage move at once, with a short arc.
   */
  place(arrivals, zone, reorder = false) {
    if (reorder) {
      arrivals.forEach(a => (a.dist = a.moved ? a.die.mesh.position.distanceTo(a.pos) : 0))
      arrivals.sort((a, b) => b.dist - a.dist)
    }

    arrivals.forEach((a, k) => {
      const { die, pos, quat, scale } = a
      const delay = zone === "stage" ? 0 : k * (reorder ? REORDER_STAGGER : COMMIT_STAGGER)
      const distance = die.mesh.position.distanceTo(pos)

      die.place = zone
      die.moveTo(pos, quat, scale)

      if (a.moved) {
        die.animate(
          arc(die.mesh.position, pos, quat, scale, {
            delay,
            height: zone === "stage" ? 3 : 4 + Math.min(distance * 0.05, 3),
            travel: zone === "stage" ? 0.3 : 0.3 + Math.min(distance * 0.012, 0.35)
          })
        )
      } else {
        die.animate(hop(pos, quat, scale, { delay }))
      }
    })
  }

  decorate(die, entry, fresh, ctx) {
    die.paint(fresh ? null : entry.face, entry.tokens)
    die.keep = Boolean(entry.keep && !entry.locked)
    die.dim = ctx.dimLocked && entry.locked
    die.clickable = ctx.clickable(entry)
  }

  /**
   * Throw dice into the bowl. The whole throw is simulated up front, so each die can carry
   * its result on the face that ends up on top; then it is replayed frame by frame.
   */
  throwAll(dice) {
    if (dice.length === 0) return
    let best = null
    for (let attempt = 0; attempt < THROW_ATTEMPTS && best?.misses !== 0; attempt++) {
      const sim = this.simulate(dice.length)
      if (!best || sim.misses < best.misses) best = sim
    }

    const ends = this.landings(best, dice.length)
    dice.forEach((die, i) => {
      const end = ends[i]
      die.script = null
      die.mode = "tumble"
      die.topSlot = end.slot
      die.track = { sim: best, index: i, count: dice.length, t: 0, end }
      die.restSpot = end.pos
      die.restQuat = end.quat
      die.moveTo(end.pos, end.quat, 1)
      die.mesh.scale.setScalar(1)
    })
  }

  /** Run one random throw of `count` dice until they come to rest, recording every step. */
  simulate(count) {
    const world = this.bowlWorld()
    const { bowl } = this.seat
    const bodies = Array.from({ length: count }, (_, i) => {
      const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(DICE_SIZE / 2, DICE_SIZE / 2, DICE_SIZE / 2)),
        linearDamping: 0.08,
        angularDamping: 0.12,
        sleepSpeedLimit: 1.5,
        sleepTimeLimit: 0.1
      })
      // spread out in a loose ring so the dice don't fall onto each other
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6
      body.position.set(
        bowl.x + Math.cos(angle) * 4.5,
        bowl.y + 9 + (i % 2) * 5 + Math.random() * 2,
        bowl.z + Math.sin(angle) * 4.5 + 2
      )
      body.velocity.set((Math.random() - 0.5) * 16, -4, -8 - Math.random() * 8)
      body.angularVelocity.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      )
      body.quaternion.setFromEuler(
        Math.random() * 6.28,
        Math.random() * 6.28,
        Math.random() * 6.28
      )
      world.addBody(body)
      return body
    })

    const frames = []
    const record = () => {
      for (const { position: p, quaternion: q } of bodies) frames.push(p.x, p.y, p.z, q.x, q.y, q.z, q.w)
    }
    record()
    let steps = 1
    const nudges = new Map()
    for (let t = 0; t < MAX_SIM_TIME; t += STEP) {
      world.step(STEP)
      record()
      steps++

      // A die that comes to rest on top of another or leaning on the wall is shoved towards free space
      for (const body of bodies) {
        if (body.sleepState !== CANNON.Body.SLEEPING || this.flat(body.position, body.quaternion)) continue
        if ((nudges.get(body) ?? 0) >= MAX_NUDGES) continue
        nudges.set(body, (nudges.get(body) ?? 0) + 1)
        const free = this.freeSpot(bodies.filter(other => other !== body).map(other => other.position))
        const dx = free.x - body.position.x
        const dz = free.z - body.position.z
        body.wakeUp()
        body.velocity.set(dx * 2.5, 8, dz * 2.5)
        body.angularVelocity.set(dz * 1.5, (Math.random() - 0.5) * 4, -dx * 1.5)
      }

      if (t >= MIN_SIM_TIME && bodies.every(body => body.sleepState === CANNON.Body.SLEEPING)) break
    }

    // drop the tail where nothing visibly moves any more
    const stride = count * 7
    const last = (steps - 1) * stride
    const still = step => {
      for (let o = 0; o < stride; o++) {
        if (Math.abs(frames[step * stride + o] - frames[last + o]) > 0.01) return false
      }
      return true
    }
    while (steps > MIN_SIM_TIME / STEP && still(steps - 2)) steps--
    for (let o = 0; o < stride; o++) frames[(steps - 1) * stride + o] = frames[last + o]
    frames.length = steps * stride

    const sim = { frames: new Float32Array(frames), steps, misses: 0 }
    for (let i = 0; i < count; i++) if (!this.landing(sim, i, count).ok) sim.misses++
    return sim
  }

  /** The point on the bowl floor furthest from all `others` (positions). */
  freeSpot(others) {
    const { bowl } = this.seat
    const limit = BOWL_RADIUS - DICE_SIZE * 0.7
    let best = null
    let room = -Infinity
    for (let ring = 0; ring <= 3; ring++) {
      const r = (ring / 3) * limit
      const around = ring === 0 ? 1 : ring * 8
      for (let k = 0; k < around; k++) {
        const angle = (k / around) * Math.PI * 2
        const spot = new THREE.Vector3(bowl.x + Math.cos(angle) * r, 0, bowl.z + Math.sin(angle) * r)
        const d = Math.min(...others.map(p => Math.hypot(p.x - spot.x, p.z - spot.z)), Infinity)
        if (d > room) [best, room] = [spot, d]
      }
    }
    return best
  }

  /** Pose of die `index` at recorded `step`. */
  frame(sim, step, index, count, pos, quat) {
    const o = (step * count + index) * 7
    const f = sim.frames
    pos.set(f[o], f[o + 1], f[o + 2])
    quat.set(f[o + 3], f[o + 4], f[o + 5], f[o + 6])
  }

  /** The face pointing most upwards for orientation `quat`, and how far up it points (cosine). */
  topFace({ x, y, z, w }) {
    const quat = new THREE.Quaternion(x, y, z, w)
    let slot = 0
    let up = -Infinity
    NORMALS.forEach((normal, i) => {
      const height = normal.clone().applyQuaternion(quat).y
      if (height > up) [slot, up] = [i, height]
    })
    return { slot, up }
  }

  /** Whether a die at rest in this pose lies (nearly) flat on the bowl floor. */
  flat(pos, quat) {
    return (
      this.topFace(quat).up >= FLAT_COS && pos.y <= this.seat.bowl.y + DICE_SIZE / 2 + FLOOR_SLACK
    )
  }

  /** Where die `index` came to rest: the face on top, and that pose laid exactly flat. */
  landing(sim, index, count) {
    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    this.frame(sim, sim.steps - 1, index, count, pos, quat)

    const { slot } = this.topFace(quat)
    const tilt = new THREE.Quaternion().setFromUnitVectors(
      NORMALS[slot].clone().applyQuaternion(quat),
      UP
    )
    const ok = this.flat(pos, quat)
    pos.y = this.seat.bowl.y + DICE_SIZE / 2 + 0.02
    return { slot, ok, pos, quat: tilt.multiply(quat).normalize() }
  }

  /**
   * Final poses for a throw. Dice that ended up on top of others go to a free rest spot, and
   * dice laid flat are nudged apart so they don't sink into a neighbour they leaned on.
   */
  landings(sim, count) {
    const ends = Array.from({ length: count }, (_, i) => this.landing(sim, i, count))
    const taken = ends.filter(end => end.ok).map(end => end.pos)
    for (const end of ends) {
      if (end.ok) continue
      const { x, z } = this.freeSpot(taken)
      end.pos.set(x, end.pos.y, z)
      taken.push(end.pos)
    }

    const { bowl } = this.seat
    const limit = BOWL_RADIUS - DICE_SIZE * 0.7
    for (let pass = 0; pass < 10; pass++) {
      for (let a = 0; a < count; a++) {
        for (let b = a + 1; b < count; b++) {
          const pa = ends[a].pos
          const pb = ends[b].pos
          const dx = pb.x - pa.x
          const dz = pb.z - pa.z
          const d = Math.hypot(dx, dz) || 0.001
          if (d >= DICE_GAP) continue
          const push = (DICE_GAP - d) / 2
          pa.x -= (dx / d) * push
          pa.z -= (dz / d) * push
          pb.x += (dx / d) * push
          pb.z += (dz / d) * push
        }
      }
      for (const { pos } of ends) {
        const dx = pos.x - bowl.x
        const dz = pos.z - bowl.z
        const r = Math.hypot(dx, dz)
        if (r > limit) {
          pos.x = bowl.x + (dx / r) * limit
          pos.z = bowl.z + (dz / r) * limit
        }
      }
    }
    return ends
  }

  /** Replay a die's part of the simulated throw, easing into its flat landing pose at the end. */
  playback(die, dt) {
    const { mesh, track } = die
    const { sim, index, count, end } = track
    track.t += dt * PLAYBACK_SPEED

    const f = Math.min(track.t / STEP, sim.steps - 1)
    const a = Math.floor(f)
    const b = Math.min(a + 1, sim.steps - 1)
    const posB = new THREE.Vector3()
    const quatB = new THREE.Quaternion()
    this.frame(sim, a, index, count, mesh.position, mesh.quaternion)
    this.frame(sim, b, index, count, posB, quatB)
    mesh.position.lerp(posB, f - a)
    mesh.quaternion.slerp(quatB, f - a)

    const left = (sim.steps - 1) * STEP - track.t
    if (left < LAND_BLEND) {
      const w = easeInOut(1 - Math.max(left, 0) / LAND_BLEND)
      mesh.position.lerp(end.pos, w)
      mesh.quaternion.slerp(end.quat, w)
    }
    if (left <= 0) {
      die.track = null
      die.mode = "rest"
    }
  }

  update(dt, now) {
    this.time += dt
    const k = 1 - Math.exp(-dt * 11)

    for (const die of this.dice.values()) {
      switch (die.mode) {
        case "tumble":
          this.playback(die, dt)
          break
        case "script":
          die.advance(dt)
          break
        default:
          die.follow(k)
      }

      die.applyLook(now)
    }
  }

  /** Jump running scripts to their end. With a tag, only the scripts started with it. */
  finishAll(tag = null) {
    for (const die of this.dice.values()) {
      if (die.script && (tag === null || die.script.tag === tag)) die.finish()
    }
  }

  setHover(id) {
    for (const die of this.dice.values()) die.hover = die.id === id
  }

  glow(id, color, seconds, now) {
    const die = this.dice.get(id)
    if (die) die.glow = { color, until: now + seconds }
  }

  /** Dim a die for the rest of a resolution step, e.g. after its attack was blocked. */
  markSpent(id) {
    const die = this.dice.get(id)
    if (die) die.spent = true
  }

  clearSpent() {
    for (const die of this.dice.values()) die.spent = false
  }
}
