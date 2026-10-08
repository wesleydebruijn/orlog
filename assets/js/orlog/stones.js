import * as THREE from "three"
import { rng } from "./textures"

const CAPACITY = 60
const COLUMNS = 5
const geometry = new THREE.SphereGeometry(1, 28, 18)
const dummy = new THREE.Object3D()

/** Health, as a pile of glass pebbles. One stone per point of health. */
export class Stones {
  constructor(parent, { origin, seed }) {
    this.parent = parent
    this.origin = origin
    this.count = null
    this.flyers = []

    const random = rng(seed)
    this.stones = Array.from({ length: CAPACITY }, (_, i) => {
      const col = i % COLUMNS
      const row = Math.floor(i / COLUMNS)
      return {
        x: origin.x + col * 3.3 + (row % 2) * 1.1 + (random() - 0.5) * 0.9,
        z: origin.z - row * 2.9 + (random() - 0.5) * 0.9,
        yaw: random() * Math.PI,
        size: 0.85 + random() * 0.3,
        scale: 0
      }
    })

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.28,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.15
    })
    this.mesh = new THREE.InstancedMesh(geometry, this.material, CAPACITY)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    this.mesh.frustumCulled = false

    const color = new THREE.Color()
    this.stones.forEach((stone, i) => {
      color.setHSL(0.36 + random() * 0.08, 0.22 + random() * 0.14, 0.4 + random() * 0.16)
      this.mesh.setColorAt(i, color)
      stone.color = color.clone()
    })
    this.mesh.instanceColor.needsUpdate = true
    parent.add(this.mesh)
    this.write()
  }

  position(i) {
    const stone = this.stones[i]
    return new THREE.Vector3(stone.x, 0.55 * stone.size, stone.z)
  }

  set(count) {
    const next = Math.max(0, Math.min(count, CAPACITY))
    if (this.count !== null && next < this.count) {
      for (let i = next; i < this.count; i++) this.fly(i)
      // the stone vanishes from the pile instantly, the flyer takes over
      for (let i = next; i < this.count; i++) this.stones[i].scale = 0
    }
    if (this.count === null) this.stones.forEach((stone, i) => (stone.scale = i < next ? 1 : 0))
    this.count = next
  }

  fly(i) {
    const stone = this.stones[i]
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshPhysicalMaterial({
        color: stone.color,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        transparent: true
      })
    )
    mesh.castShadow = true
    const from = this.position(i)
    mesh.position.copy(from)
    mesh.scale.set(1.25 * stone.size, 0.6 * stone.size, stone.size)
    this.parent.add(mesh)
    this.flyers.push({
      mesh,
      from,
      to: new THREE.Vector3(stone.x * 0.3, 0.5, this.origin.z * 0.45),
      t: 0
    })
  }

  update(dt) {
    for (let i = this.flyers.length - 1; i >= 0; i--) {
      const flyer = this.flyers[i]
      flyer.t += dt / 0.9
      const t = Math.min(flyer.t, 1)
      flyer.mesh.position.lerpVectors(flyer.from, flyer.to, t)
      flyer.mesh.position.y += Math.sin(t * Math.PI) * 9
      flyer.mesh.rotation.y += dt * 6
      flyer.mesh.material.opacity = 1 - t * t
      if (flyer.t >= 1) {
        this.parent.remove(flyer.mesh)
        flyer.mesh.material.dispose()
        this.flyers.splice(i, 1)
      }
    }
    this.write(dt)
  }

  write(dt = 0.016) {
    const k = 1 - Math.exp(-dt * 10)
    this.stones.forEach((stone, i) => {
      const target = this.count !== null && i < this.count ? 1 : 0
      stone.scale += (target - stone.scale) * k
      const s = Math.max(stone.scale, 0.0001) * stone.size
      dummy.position.set(stone.x, 0.55 * s, stone.z)
      dummy.rotation.set(0, stone.yaw, 0)
      dummy.scale.set(1.25 * s, 0.6 * s, 1.0 * s)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)
    })
    this.mesh.instanceMatrix.needsUpdate = true
  }
}
