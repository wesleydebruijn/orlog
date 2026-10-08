import * as THREE from "three"
import { hits, PHASE, STEP } from "./state"
import { arrowTexture, glyphTexture } from "./textures"

const FLIGHT = 0.75
const ease = t => t * t * (3 - 2 * t)

const planeGeometry = new THREE.PlaneGeometry(1, 1)

function projectileMaterial(map) {
  return new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  })
}

/**
 * Effects of the resolution phase. The server steps through the phase one turn at a time
 * (see Game.Phase.Resolution), so the effects are keyed on the current step:
 * clashing dice flash, attacks fly at the defender and token steals fly to the thief.
 */
export class Faceoff {
  constructor(scene, table) {
    this.scene = scene
    this.table = table
    this.key = null
    this.now = 0
    this.projectiles = []
  }

  update(model) {
    const key = `${model.round}:${model.phase}:${model.activeSeat}:${model.step}`
    const changed = this.key !== null && key !== this.key
    const first = this.key === null
    this.key = key

    if (changed) this.clear()
    if (!changed || first || model.phase !== PHASE.RESOLUTION || model.finished) return

    const acting = model.me.index === model.activeSeat ? "me" : "opp"
    const defending = acting === "me" ? "opp" : "me"

    switch (model.step) {
      case STEP.RESOLVE:
        for (const side of ["me", "opp"]) {
          for (const die of model[side].dice) {
            if (die.face.intersects > 0) {
              const color = die.face.stance === "block" ? 0x4fa8ff : 0xff7a3a
              this.table.seats[side].dice.glow(die.id, color, 1.4, this.now)
            }
          }
        }
        break

      case STEP.ATTACK:
        this.volley(model, acting, defending, die => die.face.stance === "attack", 0xff7a3a)
        break

      case STEP.STEAL:
        this.volley(model, acting, defending, die => die.face.stance === "steal", 0xe3a31c)
        break
    }
  }

  volley(model, acting, defending, filter, glowColor) {
    const seat = this.table.seats[acting]
    const target = this.table.seats[defending].world(new THREE.Vector3(-26, 2, 21))
    const start = new THREE.Vector3()

    model[acting].dice.filter(filter).forEach((die, i) => {
      if (hits(die) <= 0) return
      const mesh = seat.dice.get(die.id)?.mesh
      if (!mesh) return

      mesh.getWorldPosition(start)
      seat.dice.glow(die.id, glowColor, 1.2, this.now)

      const ranged = die.face.type === "ranged"
      const isSteal = die.face.stance === "steal"
      const dest = isSteal
        ? this.table.seats[acting].world(new THREE.Vector3(30, 2, 10))
        : target.clone()
      const from = isSteal ? this.table.seats[defending].world(new THREE.Vector3(30, 2, 10)) : start.clone()

      const map = isSteal
        ? glyphTexture("token_steal", "#ffd36b")
        : ranged
          ? arrowTexture()
          : glyphTexture("melee_attack", "#ffffff")

      const group = new THREE.Group()
      const plane = new THREE.Mesh(planeGeometry, projectileMaterial(map))
      plane.rotation.x = -Math.PI / 2
      plane.scale.set(ranged && !isSteal ? 1.4 : 4, ranged && !isSteal ? 5.6 : 4, 1)
      plane.renderOrder = 5
      group.add(plane)

      const dir = dest.clone().sub(from)
      group.rotation.y = ranged && !isSteal ? Math.atan2(-dir.x, -dir.z) : 0

      group.position.copy(from)
      this.scene.add(group)
      this.projectiles.push({ group, plane, from: from.clone(), to: dest, t: -i * 0.12 })
    })
  }

  clear() {
    this.projectiles.forEach(({ group, plane }) => {
      this.scene.remove(group)
      plane.material.dispose()
    })
    this.projectiles = []
  }

  frame(dt, now) {
    this.now = now
    this.projectiles.forEach(projectile => {
      projectile.t += dt / FLIGHT
      const t = Math.min(Math.max(projectile.t, 0), 1)
      const { group, plane, from, to } = projectile

      group.visible = projectile.t >= 0
      group.position.lerpVectors(from, to, ease(t))
      group.position.y = 3 + Math.sin(t * Math.PI) * 3
      plane.material.opacity = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2

      // linger and loop for as long as the step lasts
      if (projectile.t > 1.35) projectile.t = 0
    })
  }
}
