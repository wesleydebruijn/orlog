import * as THREE from "three"
import { RoundedBoxGeometry } from "../../vendor/three/RoundedBoxGeometry.js"
import { labelTexture, tokenPlateTexture } from "./textures"

const CAPACITY = 48
const PER_COLUMN = 8
const PLATE = 3.4
const THICKNESS = 0.5

const geometry = new RoundedBoxGeometry(PLATE, THICKNESS, PLATE, 2, 0.12)
const dummy = new THREE.Object3D()

/** Tokens, as stacked golden plates (dark bronze for the opponent) with a counter above. */
export class Tokens {
  constructor(parent, { origin, tint }) {
    this.parent = parent
    this.origin = origin
    this.count = null
    this.scales = new Array(CAPACITY).fill(0)
    this.flyers = []

    const plate = new THREE.MeshStandardMaterial({
      map: tokenPlateTexture(),
      color: tint,
      roughness: 0.38,
      metalness: 0.75
    })
    const side = new THREE.MeshStandardMaterial({ color: tint, roughness: 0.4, metalness: 0.8 })
    this.mesh = new THREE.InstancedMesh(geometry, [side, side, plate, side, side, side], CAPACITY)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.frustumCulled = false
    parent.add(this.mesh)

    this.label = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, transparent: true }))
    this.label.scale.set(4.5, 2.25, 1)
    this.label.renderOrder = 10
    parent.add(this.label)
  }

  slot(i) {
    const col = Math.floor(i / PER_COLUMN)
    const level = i % PER_COLUMN
    return new THREE.Vector3(
      this.origin.x + col * (PLATE + 1.1) + (level % 2) * 0.12,
      THICKNESS / 2 + level * THICKNESS * 1.02,
      this.origin.z + (level % 3) * 0.08
    )
  }

  set(count) {
    const next = Math.max(0, Math.min(count, CAPACITY))
    if (this.count !== null && next < this.count) {
      for (let i = next; i < this.count; i++) {
        this.scales[i] = 0
        this.fly(i)
      }
    }
    if (this.count === null) this.scales = this.scales.map((_, i) => (i < next ? 1 : 0))

    if (this.count !== next) {
      this.label.material.map?.dispose()
      this.label.material.map = labelTexture(String(count))
      this.label.material.needsUpdate = true
    }
    this.count = next
    this.label.visible = next > 0
    const top = this.slot(Math.max(next - 1, 0))
    this.label.position.set(this.origin.x + 1.7, top.y + 3.2, this.origin.z + PLATE + 1.4)
  }

  fly(i) {
    const mesh = new THREE.Mesh(geometry, this.mesh.material[2])
    mesh.position.copy(this.slot(i))
    this.parent.add(mesh)
    this.flyers.push({ mesh, from: this.slot(i), t: 0 })
  }

  update(dt) {
    for (let i = this.flyers.length - 1; i >= 0; i--) {
      const flyer = this.flyers[i]
      flyer.t += dt / 0.8
      const t = Math.min(flyer.t, 1)
      flyer.mesh.position.set(flyer.from.x, flyer.from.y + t * 10, flyer.from.z)
      flyer.mesh.scale.setScalar(1 - t)
      flyer.mesh.rotation.y += dt * 8
      if (flyer.t >= 1) {
        this.parent.remove(flyer.mesh)
        this.flyers.splice(i, 1)
      }
    }

    const k = 1 - Math.exp(-dt * 10)
    for (let i = 0; i < CAPACITY; i++) {
      const target = this.count !== null && i < this.count ? 1 : 0
      this.scales[i] += (target - this.scales[i]) * k
      const slot = this.slot(i)
      dummy.position.copy(slot)
      dummy.position.y += (1 - this.scales[i]) * 4
      dummy.rotation.set(0, ((i * 37) % 11) * 0.03, 0)
      dummy.scale.setScalar(Math.max(this.scales[i], 0.0001))
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true
  }
}
