import * as THREE from "three"
import { DICE_GEOMETRY, easeIn, easeInOut, easeOut, SLOT_UP } from "../dice"
import { createScene } from "../scene"
import { faceTexture } from "../textures"

const ELEVATION = THREE.MathUtils.degToRad(15)

const FIT = {
  target: new THREE.Vector3(0, 0.5, 0),
  elevation: ELEVATION,
  halfWidth: 5,
  halfDepth: 5,
  margin: 1,
  parallax: 0.3
}

// One entry per box group of the die, in the same order as SLOT_UP
const FACES = [
  { type: "melee", stance: "attack", tokens: false, omen: "The axe falls. Strike first, strike true." },
  { type: "melee", stance: "block", tokens: false, omen: "The helm holds against the blow." },
  { type: "ranged", stance: "attack", tokens: false, omen: "Odin's ravens fly swift." },
  { type: "ranged", stance: "block", tokens: false, omen: "The shield-wall does not break." },
  { type: "token", stance: "steal", tokens: false, omen: "Loki's hand takes what is yours." },
  { type: "melee", stance: "attack", tokens: true, omen: "The gods smile. A favor token is yours." }
]

const ROLL_TIME = 1.2
const HOP_HEIGHT = 2.2
const SETTLE_FROM = 0.55
const PULSE_TIME = 0.9
const GOLD = new THREE.Color(0xd6a23a)
const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)

// Tilts a face that lies on top so it looks straight at the camera
const FACE_CAMERA = new THREE.Quaternion().setFromAxisAngle(X_AXIS, Math.PI / 2 - ELEVATION)

const showing = slot => FACE_CAMERA.clone().multiply(SLOT_UP[slot])

/** A single carved die above the homepage title that can be cast for an omen. */
export function createRuneDie(canvas, { onLand, reducedMotion = false }) {
  let stage
  try {
    stage = createScene(canvas, { fit: FIT, transparent: true, shadows: false })
  } catch {
    canvas.parentElement.hidden = true
    return
  }

  const materials = FACES.map(
    face => new THREE.MeshStandardMaterial({ map: faceTexture(face), roughness: 0.55, metalness: 0 })
  )
  const die = new THREE.Mesh(DICE_GEOMETRY, materials)
  die.quaternion.setFromEuler(new THREE.Euler(0.5, 0.6, 0.2))
  stage.scene.add(die)

  let landed = null
  let roll = null
  let pulse = 0
  let clock = 0

  function cast() {
    if (roll) return
    const slot = Math.floor(Math.random() * FACES.length)
    const spin = new THREE.Vector3().randomDirection().multiplyScalar(14 + Math.random() * 6)
    roll = { slot, spin, time: 0, tumble: die.quaternion.clone(), end: showing(slot) }
    if (reducedMotion) roll.time = ROLL_TIME
  }

  function land() {
    landed = { slot: roll.slot, quat: roll.end, at: clock }
    roll = null
    pulse = PULSE_TIME
    onLand(FACES[landed.slot])
  }

  const step = new THREE.Quaternion()

  function animateRoll(dt) {
    roll.time = Math.min(roll.time + dt, ROLL_TIME)
    const t = roll.time / ROLL_TIME

    const decay = 1 - easeOut(t)
    step.setFromAxisAngle(roll.spin.clone().normalize(), roll.spin.length() * decay * dt)
    roll.tumble.premultiply(step)

    const settle = easeInOut(THREE.MathUtils.clamp((t - SETTLE_FROM) / (1 - SETTLE_FROM), 0, 1))
    die.quaternion.slerpQuaternions(roll.tumble, roll.end, settle)

    const rise = t < 0.4 ? easeOut(t / 0.4) : 1 - easeIn((t - 0.4) / 0.6)
    die.position.y = rise * HOP_HEIGHT

    if (t >= 1) land()
  }

  function idle(dt) {
    if (reducedMotion) return
    const since = clock - (landed?.at ?? 0)
    die.position.y = Math.sin(since * 1.6) * 0.25
    if (landed) {
      step.setFromAxisAngle(Y_AXIS, Math.sin(since * 0.8) * 0.12)
      die.quaternion.copy(step).multiply(landed.quat)
    } else {
      step.setFromEuler(new THREE.Euler(0.35 * dt, 0.6 * dt, 0.15 * dt))
      die.quaternion.premultiply(step)
    }
  }

  function glow(dt) {
    pulse = Math.max(pulse - dt, 0)
    const strength = Math.sin((pulse / PULSE_TIME) * Math.PI) * 0.6
    materials.forEach(material => material.emissive.copy(GOLD).multiplyScalar(strength))
  }

  stage.onFrame(dt => {
    clock += dt
    if (roll) animateRoll(dt)
    else idle(dt)
    glow(dt)
  })

  canvas.addEventListener("click", cast)
  canvas.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    cast()
  })
}
