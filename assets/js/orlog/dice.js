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

const UP = new THREE.Vector3(0, 1, 0)

const hash = id => {
  let h = 0
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}
const jitter = (id, salt, amount) => (((hash(id) * (salt + 3)) % 1000) / 1000 - 0.5) * 2 * amount
const ease = t => 1 - Math.pow(1 - t, 3)

class Die {
  constructor(id, seat) {
    this.id = id
    this.seat = seat
    this.mode = "rest"
    this.look = ""
    this.hover = false
    this.dim = false
    this.clickable = false
    this.glow = null // { color, until }

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

  /** Shade the die: dimmed when locked, amber when kept, bright on hover or effects. */
  applyLook(now) {
    const glowing = this.glow && this.glow.until > now ? this.glow : null
    const key = `${this.dim}-${this.hover}-${this.keep}-${glowing ? glowing.color : ""}`
    if (key === this.look && !glowing) return
    this.look = key

    const shade = this.dim ? 0.74 : 1
    const emissive = new THREE.Color(0x000000)
    if (this.keep && !this.dim) emissive.setHex(0x3a2408)
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
   * @param layout {row, bowl} entries from state.layoutDice
   * @param ctx {rolled, fresh, dimLocked, clickable: id => boolean}
   */
  sync(layout, ctx) {
    const { row, bowl } = layout
    const justRolled = this.prevRolled === false && ctx.rolled === true
    this.prevRolled = ctx.rolled

    const wanted = new Set([...row, ...bowl].filter(e => !e.placeholder).map(e => e.id))
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

    // The row, left to right on screen for both players
    const count = row.length
    const spacing = Math.min(5.3, 56 / Math.max(count, 1))
    const scale = Math.min(1, spacing / 4.9)
    row.forEach((entry, i) => {
      if (entry.placeholder) return
      const die = ensure(entry.id)
      const worldX = (i - (count - 1) / 2) * spacing
      const pos = new THREE.Vector3(
        this.seat.side * worldX,
        (DICE_SIZE * scale) / 2 + 0.02,
        this.seat.rowZ
      )
      this.release(die)
      die.mode = "row"
      die.moveTo(pos, this.upright(jitter(entry.id, 2, 0.06)), scale)
      this.decorate(die, entry, false, ctx)
    })

    bowl.forEach((entry, i) => {
      const die = ensure(entry.id)
      const spot = this.restSpot(i, bowl.length)
      const blank = ctx.fresh
      this.decorate(die, entry, blank, ctx)

      if (justRolled) {
        this.throwDie(die, i, spot)
      } else if (die.mode === "row") {
        die.mode = "rest"
        die.moveTo(spot, this.upright(die.restYaw), 1)
      } else if (die.mode === "rest" || die.mode === "init") {
        die.mode = "rest"
        die.moveTo(spot, this.upright(die.restYaw), 1)
      } else {
        die.restSpot = spot // tumbling dice settle onto their (possibly new) spot
      }
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

  decorate(die, entry, blank, ctx) {
    die.setFace(entry.face, entry.tokens, blank)
    die.keep = entry.keep
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
          const t = ease(Math.min(die.settleTime / SETTLE_TIME, 1))
          mesh.position.lerpVectors(die.from.pos, target.pos, t)
          mesh.quaternion.slerpQuaternions(die.from.quat, target.quat, t)
          if (die.settleTime >= SETTLE_TIME) die.mode = "rest"
          break
        }
        default: {
          const distance = mesh.position.distanceTo(target.pos)
          mesh.position.lerp(target.pos, k)
          mesh.quaternion.slerp(target.quat, k)
          const s = mesh.scale.x + (target.scale - mesh.scale.x) * k
          mesh.scale.setScalar(s)
          // little hop while travelling between the bowl and the row
          mesh.position.y += Math.min(distance * 0.06, 1.2) * Math.min(1, distance / 2)
        }
      }

      die.applyLook(now)
    }
  }

  setHover(id) {
    for (const die of this.dice.values()) die.hover = die.id === id
  }

  glow(id, color, seconds, now) {
    const die = this.dice.get(id)
    if (die) die.glow = { color, until: now + seconds }
  }
}
