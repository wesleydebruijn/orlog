import * as THREE from "three"
import { DICE_SIZE, easeIn, easeInOut, easeOut } from "./dice"
import { hits, layoutDice, PHASE, STEP } from "./state"
import { arrowTexture, glyphTexture, ringTexture } from "./textures"

// Timing of one attack beat, in seconds. The server leaves BEAT per die (see
// Game.Lobby.auto_turn_delay), plus LEAD before the first one.
const LEAD = 0.25
const BEAT = 0.65
const PUSH = 0.18
const FLIGHT = 0.3
const TOKEN_FLIGHT = 0.45

const ATTACK_COLOR = 0xff7a3a
const BLOCK_COLOR = 0x4fa8ff
const STEAL_COLOR = 0xe3a31c

const Z = new THREE.Vector3(0, 0, 1)
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const plateGeometry = new THREE.BoxGeometry(3.4, 0.5, 3.4)
const plateMaterial = new THREE.MeshStandardMaterial({
  color: 0xd9a52c,
  roughness: 0.38,
  metalness: 0.75
})

function glowMaterial(map, color = 0xffffff) {
  return new THREE.MeshBasicMaterial({
    map,
    color,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  })
}

const emptyPlan = () => ({
  me: { stones: [], tokens: [], quiet: false },
  opp: { stones: [], tokens: [], quiet: false }
})

/**
 * Effects of the resolution phase. The server steps through the phase one turn at a time
 * (see Game.Phase.Resolution). On the attack and steal steps the dice play out in beats,
 * one die at a time, like in Valhalla: an attacker pushes to the middle, and either meets
 * a blocker of its kind (they clash and the attack is stopped) or strikes the defender's
 * pile of stones. Hands push forward and the stolen tokens travel to the thief.
 *
 * The beats also work out when each hit lands, so the stones and tokens (see `plan`)
 * leave the piles at that moment rather than when the state arrives.
 */
export class Faceoff {
  constructor(scene, table) {
    this.scene = scene
    this.table = table
    this.key = null
    this.now = 0
    this.clock = 0
    this.events = [] // {at, fn}, run when the step clock reaches `at`
    this.effects = []
    this.scripts = new Map()
    this.plan = emptyPlan()
  }

  /** Returns whether the resolution step changed since the last update. */
  update(model) {
    const key = `${model.round}:${model.phase}:${model.activeSeat}:${model.step}`
    const changed = this.key !== null && key !== this.key
    this.key = key

    if (changed) this.clear()
    if (!changed || model.phase !== PHASE.RESOLUTION || model.finished) return changed

    const acting = model.me.index === model.activeSeat ? "me" : "opp"
    const defending = acting === "me" ? "opp" : "me"
    const rows = {
      me: layoutDice(model, model.me, model.opp).row,
      opp: layoutDice(model, model.opp, model.me).row
    }

    switch (model.step) {
      case STEP.ATTACK:
        this.attack(model, acting, defending, rows)
        break

      case STEP.STEAL:
        this.steal(model, acting, defending, rows)
        break
    }

    this.scripts.forEach((script, die) => die.animate(script.steps, { tag: "beat" }))
    this.scripts.clear()
    this.events.sort((a, b) => a.at - b.at)
    return changed
  }

  // --- planning ------------------------------------------------------------------

  die(side, id) {
    return this.table.seats[side].dice.get(id)
  }

  slot(die) {
    return { pos: die.target.pos.clone(), quat: die.target.quat.clone(), scale: die.target.scale }
  }

  /** Add keyframes to a die's script, to start `at` seconds into the step. */
  queue(die, at, steps) {
    const script = this.scripts.get(die) ?? { steps: [], cursor: 0 }
    steps[0] = { ...steps[0], delay: Math.max(0, at - script.cursor) }
    script.steps.push(...steps)
    script.cursor = at + steps.reduce((sum, step) => sum + step.duration, 0)
    this.scripts.set(die, script)
  }

  at(time, fn) {
    this.events.push({ at: time, fn })
  }

  /** Move a die's slot towards the middle line (z = 0) and up. */
  lunge(slot, z, lift) {
    const pos = slot.pos.clone()
    pos.z = z
    pos.y += lift
    return pos
  }

  hitZ(slot) {
    return (DICE_SIZE * slot.scale) / 2 + 0.12
  }

  clashSteps(slot, back, tilt) {
    const z = this.hitZ(slot)
    const shaken = new THREE.Quaternion().setFromAxisAngle(Z, tilt).multiply(slot.quat)
    return [
      { pos: this.lunge(slot, z + 1.4, 1.4), duration: 0.2, ease: easeOut },
      { pos: this.lunge(slot, z, 0), duration: 0.08, ease: easeIn },
      { pos: this.lunge(slot, z + back, 0.6), quat: shaken, duration: 0.1, ease: easeOut },
      { pos: slot.pos.clone(), quat: slot.quat, scale: slot.scale, duration: 0.2, ease: easeInOut }
    ]
  }

  pushSteps(slot) {
    return [
      { pos: this.lunge(slot, this.hitZ(slot) + 1.6, 1.6), duration: PUSH, ease: easeOut },
      { duration: 0.2 },
      { pos: slot.pos.clone(), quat: slot.quat, scale: slot.scale, duration: 0.2, ease: easeInOut }
    ]
  }

  attack(model, acting, defending, rows) {
    const used = new Map() // blocker id -> clashes taken so far
    const impacts = []
    let beat = 0

    rows[acting].forEach((entry, column) => {
      const { face } = entry
      if (entry.placeholder || face.stance !== "attack" || face.disabled) return
      const die = this.die(acting, entry.id)
      if (!die) return

      const total = Math.max(face.count, 1)
      const blocked = Math.min(face.intersects, total)
      const slot = this.slot(die)

      for (let i = 0; i < total; i++) {
        const at = LEAD + beat++ * BEAT

        if (i < blocked) {
          const blocker = this.pickBlocker(rows[defending], column, face.type, used)
          const blockerDie = blocker && this.die(defending, blocker.id)
          this.clash(acting, defending, die, blockerDie, slot, at)
        } else {
          impacts.push(this.strike(acting, defending, die, face, slot, at))
        }
      }
    })

    this.plan[defending].stones = impacts
  }

  /** The block die an attack runs into: the one opposite it, else any of its kind with a block left. */
  pickBlocker(row, column, type, used) {
    const blockers = row.filter(
      entry =>
        !entry.placeholder &&
        entry.face.stance === "block" &&
        entry.face.type === type &&
        !entry.face.disabled
    )
    const open = entry => entry.face.intersects - (used.get(entry.id) || 0) > 0

    const opposite = blockers.find(entry => entry === row[column])
    const pick = (opposite && open(opposite) ? opposite : blockers.find(open)) ?? blockers[0]
    if (pick) used.set(pick.id, (used.get(pick.id) || 0) + 1)
    return pick
  }

  clash(acting, defending, attacker, blocker, slot, at) {
    this.queue(attacker, at, this.clashSteps(slot, 1.8, 0.2))
    if (blocker) this.queue(blocker, at, this.clashSteps(this.slot(blocker), 0.6, -0.16))

    this.at(at + 0.28, () => {
      const seat = this.table.seats[acting]
      seat.dice.glow(attacker.id, ATTACK_COLOR, 0.5, this.now)
      seat.dice.markSpent(attacker.id)
      if (blocker) this.table.seats[defending].dice.glow(blocker.id, BLOCK_COLOR, 0.5, this.now)
      this.ring(seat.world(new THREE.Vector3(slot.pos.x, 2.5, 0)), 0xcfe6ff, 6)
    })
  }

  /** An attack nobody blocked: the die pushes forward and a projectile hits the defender's stones. */
  strike(acting, defending, die, face, slot, at) {
    this.queue(die, at, this.pushSteps(slot))

    const ranged = face.type === "ranged"
    const target = this.table.seats[defending].world(new THREE.Vector3(-26, 2, 21))
    const from = this.table.seats[acting].world(
      this.lunge(slot, this.hitZ(slot) + 1.6, 1.6).setY(3)
    )

    this.at(at + PUSH, () => {
      this.table.seats[acting].dice.glow(die.id, ATTACK_COLOR, 0.4, this.now)
      this.projectile(from, target, { ranged, duration: FLIGHT })
    })

    return at + PUSH + FLIGHT
  }

  steal(model, acting, defending, rows) {
    const victim = this.table.seats[defending].tokens
    const thief = this.table.seats[acting].tokens
    const victimStart = victim.goal ?? 0
    const thiefStart = thief.goal ?? 0
    let remaining = Math.max(0, victimStart - model[defending].tokens)
    let moved = 0
    let beat = 0

    const launches = []
    const arrivals = []

    rows[acting].forEach(entry => {
      const { face } = entry
      if (entry.placeholder || face.stance !== "steal" || face.disabled || hits(entry) <= 0) return
      const die = this.die(acting, entry.id)
      if (!die) return

      const at = LEAD + beat++ * BEAT
      this.queue(die, at, this.pushSteps(this.slot(die)))
      this.at(at + PUSH, () => this.table.seats[acting].dice.glow(die.id, STEAL_COLOR, 0.45, this.now))

      const count = Math.min(remaining, Math.ceil(hits(entry) * (face.amount || 1)))
      for (let j = 0; j < count; j++, moved++) {
        const launch = at + PUSH + j * 0.12
        const from = this.table.seats[defending].world(victim.slot(victimStart - 1 - moved))
        const to = this.table.seats[acting].world(thief.slot(thiefStart + moved))
        this.at(launch, () => this.flyToken(from, to))
        launches.push(launch)
        arrivals.push(launch + TOKEN_FLIGHT)
      }
      remaining -= count
    })

    this.plan[defending].tokens = launches
    this.plan[defending].quiet = true // the flying plate takes over from the usual float-away
    this.plan[acting].tokens = arrivals
  }

  // --- effects -------------------------------------------------------------------

  addEffect({ object, material = null, duration, tick, done = null }) {
    this.scene.add(object)
    this.effects.push({ object, material, duration, tick, done, t: 0 })
  }

  projectile(from, to, { ranged, duration }) {
    const map = ranged ? arrowTexture() : glyphTexture("melee_attack", "#ffffff")
    const material = glowMaterial(map)
    const group = new THREE.Group()
    const plane = new THREE.Mesh(planeGeometry, material)
    plane.rotation.x = -Math.PI / 2
    plane.scale.set(ranged ? 1.4 : 4, ranged ? 5.6 : 4, 1)
    plane.renderOrder = 5
    group.add(plane)

    const dir = to.clone().sub(from)
    group.rotation.y = ranged ? Math.atan2(-dir.x, -dir.z) : 0
    group.position.copy(from)

    this.addEffect({
      object: group,
      material,
      duration,
      tick: t => {
        group.position.lerpVectors(from, to, easeInOut(t))
        group.position.y = 3 + Math.sin(t * Math.PI) * 3
        material.opacity = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2
      },
      done: () => this.ring(to, ATTACK_COLOR, 7)
    })
  }

  ring(position, color, size) {
    const material = glowMaterial(ringTexture(), color)
    const plane = new THREE.Mesh(planeGeometry, material)
    plane.rotation.x = -Math.PI / 2
    plane.position.copy(position)
    plane.renderOrder = 6

    this.addEffect({
      object: plane,
      material,
      duration: 0.35,
      tick: t => {
        plane.scale.setScalar(size * (0.35 + 0.65 * easeOut(t)))
        material.opacity = 1 - t * t
      }
    })
  }

  flyToken(from, to) {
    const plate = new THREE.Mesh(plateGeometry, plateMaterial)
    plate.castShadow = true
    plate.position.copy(from)

    this.addEffect({
      object: plate,
      duration: TOKEN_FLIGHT,
      tick: t => {
        plate.position.lerpVectors(from, to, easeInOut(t))
        plate.position.y += Math.sin(t * Math.PI) * 8
        plate.rotation.y = t * Math.PI * 3
      },
      done: () => this.ring(to, STEAL_COLOR, 5)
    })
  }

  // --- life cycle ----------------------------------------------------------------

  /** Forget the previous step: effects vanish, running dice scripts jump to their end. */
  clear() {
    this.events = []
    this.effects.forEach(effect => this.dispose(effect))
    this.effects = []
    this.scripts.clear()
    this.clock = 0
    this.plan = emptyPlan()

    for (const seat of Object.values(this.table.seats)) {
      seat.dice.finishAll("beat")
      seat.dice.clearSpent()
    }
  }

  dispose({ object, material }) {
    this.scene.remove(object)
    material?.dispose()
  }

  frame(dt, now) {
    this.now = now
    this.clock += dt

    while (this.events.length && this.events[0].at <= this.clock) this.events.shift().fn()

    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i]
      effect.t = Math.min(effect.t + dt / effect.duration, 1)
      effect.tick(effect.t)

      if (effect.t >= 1) {
        this.effects.splice(i, 1)
        this.dispose(effect)
        effect.done?.()
      }
    }
  }
}
