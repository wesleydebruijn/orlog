import * as THREE from "three"
import * as CANNON from "cannon-es"
import { RoundedBoxGeometry } from "../../vendor/three/RoundedBoxGeometry.js"
import { faceTexture } from "./textures"

export const DICE_SIZE = 4
const geometry = new RoundedBoxGeometry(DICE_SIZE, DICE_SIZE, DICE_SIZE, 3, 0.55)

// Box groups are ordered +x, -x, +y, -y, +z, -z. The +y face carries the rolled result;
// the other five are decoration, so a tumbling die shows a mix of symbols.
const TOP = 2
const DECOR_SLOTS = [0, 1, 3, 4, 5]
const DECOR_FACES = [
  { type: "melee", stance: "attack", tokens: false },
  { type: "ranged", stance: "block", tokens: false },
  { type: "ranged", stance: "attack", tokens: true },
  { type: "melee", stance: "block", tokens: true },
  { type: "token", stance: "steal", tokens: false }
]

const GRAVITY = -80
const BOWL_RADIUS = 9.2
const TUMBLE_TIME = 1.0
const SETTLE_TIME = 0.4

// A die marked to keep moves out of the bowl into a column beside it (seat-local
// coordinates, between the bowl and the favor plaques)
const STAGE_X = 13.8
const STAGE_Z = 10.5

const COMMIT_STAGGER = 0.12
const REORDER_STAGGER = 0.08

const UP = new THREE.Vector3(0, 1, 0)

const hash = id => {
  let h = 0
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
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
    this.mode = "rest" // rest | row | tumble | settle | script
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
    const order = DECOR_FACES.map((face, i) => [hash(`${id}-${i}`), face]).sort(
      (a, b) => a[0] - b[0]
    )
    DECOR_SLOTS.forEach((slot, i) => {
      this.materials[slot].map = faceTexture({ ...order[i][1], disabled: false })
    })

    this.mesh = new THREE.Mesh(geometry, this.materials)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.userData = { kind: "die", seat: seat.name, id }

    this.target = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), scale: 1 }
    this.restYaw = jitter(id, 1, 0.5)
    this.mesh.position.set(0, -10, 0)
    this.snap = true
  }

  setFace(face, tokens, blank) {
    const key = blank ? "blank" : `${face.type}-${face.stance}-${tokens > 0}-${face.disabled}`
    if (key === this.faceKey) return
    this.faceKey = key
    this.materials[TOP].map = faceTexture({
      type: face.type,
      stance: face.stance,
      tokens: tokens > 0,
      disabled: face.disabled,
      blank
    })
    this.materials[TOP].needsUpdate = true
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

    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, GRAVITY, 0) })
    this.world.defaultContactMaterial.restitution = 0.35
    this.world.defaultContactMaterial.friction = 0.35
    this.buildBowlColliders()
  }

  buildBowlColliders() {
    const { bowl } = this.seat
    const floor = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() })
    floor.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    floor.position.set(0, bowl.y, 0)
    this.world.addBody(floor)

    const walls = 20
    for (let i = 0; i < walls; i++) {
      const theta = (i / walls) * Math.PI * 2
      const wall = new CANNON.Body({
        mass: 0,
        shape: new CANNON.Box(new CANNON.Vec3(2.4, 8, 0.6))
      })
      wall.position.set(
        bowl.x + Math.cos(theta) * (BOWL_RADIUS + 0.6),
        bowl.y + 8,
        bowl.z + Math.sin(theta) * (BOWL_RADIUS + 0.6)
      )
      wall.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2 - theta)
      this.world.addBody(wall)
    }
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
        this.release(die)
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
      const quat = this.upright(jitter(entry.id, 2, 0.06))
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
      const quat = this.upright(die.restYaw)
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
    const comeBack = []
    bowl.forEach((entry, i) => {
      const die = ensure(entry.id)
      const spot = this.restSpot(i, bowl.length)
      this.decorate(die, entry, ctx.fresh, ctx)

      if (justRolled) {
        die.place = "bowl"
        this.throwDie(die, i, spot)
      } else if (die.place !== "bowl" && !die.snap) {
        comeBack.push({ die, spot })
      } else if (die.snap || !die.restSpot) {
        die.place = "bowl"
        die.mode = "rest"
        die.restSpot = spot
        die.moveTo(spot, this.upright(die.restYaw), 1)
      } else if (die.mode === "rest") {
        die.moveTo(die.restSpot, this.upright(die.restYaw), 1)
      }
    })

    // A die put back from the stage returns to the spot where it landed. When the dice come
    // back from the row (a new round) the bowl is laid out afresh, one after another.
    let fromRow = 0
    comeBack.forEach(({ die, spot }) => {
      const fromStage = die.place === "stage" && die.restSpot
      const target = fromStage ? die.restSpot : spot
      const quat = this.upright(die.restYaw)
      const delay = fromStage ? 0 : fromRow++ * COMMIT_STAGGER

      die.place = "bowl"
      die.restSpot = target
      this.release(die)
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
      this.release(die)
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

  decorate(die, entry, blank, ctx) {
    die.setFace(entry.face, entry.tokens, blank)
    die.keep = Boolean(entry.keep && !entry.locked)
    die.dim = ctx.dimLocked && entry.locked
    die.clickable = ctx.clickable(entry)
  }

  upright(yaw) {
    return new THREE.Quaternion().setFromAxisAngle(UP, yaw)
  }

  throwDie(die, index, spot) {
    this.release(die)
    const { bowl } = this.seat
    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(DICE_SIZE / 2, DICE_SIZE / 2, DICE_SIZE / 2)),
      linearDamping: 0.08,
      angularDamping: 0.12
    })
    body.position.set(
      bowl.x + (Math.random() - 0.5) * 8,
      bowl.y + 9 + index * 4.3,
      bowl.z + (Math.random() - 0.5) * 8 + 4
    )
    body.velocity.set((Math.random() - 0.5) * 16, -4, -10 - Math.random() * 8)
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
    this.world.addBody(body)

    die.body = body
    die.script = null
    die.mode = "tumble"
    die.tumbleTime = 0
    die.restSpot = spot
    die.mesh.scale.setScalar(1)
    die.target.scale = 1
  }

  release(die) {
    if (die.body) {
      this.world.removeBody(die.body)
      die.body = null
    }
  }

  update(dt, now) {
    this.time += dt
    const tumbling = [...this.dice.values()].some(die => die.mode === "tumble")
    if (tumbling) this.world.step(1 / 60, dt, 4)

    const k = 1 - Math.exp(-dt * 11)

    for (const die of this.dice.values()) {
      const { mesh, target } = die

      switch (die.mode) {
        case "tumble": {
          die.tumbleTime += dt
          mesh.position.copy(die.body.position)
          mesh.quaternion.copy(die.body.quaternion)
          if (die.tumbleTime >= TUMBLE_TIME) {
            die.mode = "settle"
            die.settleTime = 0
            die.from = { pos: mesh.position.clone(), quat: mesh.quaternion.clone() }
            this.release(die)
            die.moveTo(die.restSpot, this.upright(die.restYaw), 1)
          }
          break
        }
        case "settle": {
          die.settleTime += dt
          const t = easeOut(Math.min(die.settleTime / SETTLE_TIME, 1))
          mesh.position.lerpVectors(die.from.pos, target.pos, t)
          mesh.quaternion.slerpQuaternions(die.from.quat, target.quat, t)
          if (die.settleTime >= SETTLE_TIME) die.mode = "rest"
          break
        }
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
