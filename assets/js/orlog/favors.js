import * as THREE from "three"
import { RoundedBoxGeometry } from "../../vendor/three/RoundedBoxGeometry.js"
import { plaqueTexture, woodTexture } from "./textures"

const WIDTH = 6.2
const LENGTH = 13.5
const HEIGHT = 0.9
const geometry = new RoundedBoxGeometry(WIDTH, HEIGHT, LENGTH, 3, 0.28)

// Top face first in texture space, see RoundedBoxGeometry group order: +x -x +y -y +z -z
const TOP = 2

/** The god favor plaques a player brought to the table. */
export class Plaques {
  constructor(parent, { side, catalog, origin }) {
    this.parent = parent
    this.side = side
    this.catalog = catalog
    this.origin = origin // seat-local x where the first plaque starts, z of the plaques
    this.items = []
    this.wood = new THREE.MeshStandardMaterial({
      map: woodTexture("#5d3818", 5),
      roughness: 0.6,
      color: 0xd0b090
    })
    this.signature = ""
  }

  meshes() {
    return this.items.map(item => item.mesh)
  }

  /** @param favors favor catalogue ids per slot (0 = empty), slots is the amount of slots */
  set(favors, slots, invoked, name) {
    const signature = `${favors.join(",")}|${slots}`
    if (signature !== this.signature) {
      this.signature = signature
      this.rebuild(favors, slots, name)
    }
    this.items.forEach(item => (item.invoked = item.slot === invoked))
  }

  rebuild(favors, slots, name) {
    this.items.forEach(item => {
      this.parent.remove(item.mesh)
      item.mesh.material[TOP].dispose()
    })
    this.items = []

    const scale = slots > 3 ? 0.8 : 1
    const spacing = WIDTH * scale + 1.1

    favors.slice(0, slots).forEach((favorId, i) => {
      const favor = this.catalog[favorId]
      if (!favor) return

      const top = new THREE.MeshStandardMaterial({
        map: plaqueTexture(favor.name, i + 1),
        roughness: 0.55
      })
      const mesh = new THREE.Mesh(geometry, [
        this.wood,
        this.wood,
        top,
        this.wood,
        this.wood,
        this.wood
      ])
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.scale.setScalar(scale)

      const home = new THREE.Vector3(
        this.origin.x + (WIDTH * scale) / 2 + i * spacing,
        (HEIGHT * scale) / 2,
        this.origin.z
      )
      mesh.position.copy(home)
      mesh.userData = { kind: "plaque", seat: name, slot: i + 1, favorId }
      this.parent.add(mesh)
      this.items.push({ mesh, home, slot: i + 1, hover: false, invoked: false, scale })
    })
  }

  setHover(slot) {
    this.items.forEach(item => (item.hover = item.slot === slot))
  }

  update(dt, now) {
    const k = 1 - Math.exp(-dt * 9)
    this.items.forEach(item => {
      const lift = item.invoked ? 2.4 : item.hover ? 1.2 : 0
      const toward = item.invoked ? -9 : 0
      const target = item.home.clone()
      target.y += lift
      target.z += toward
      item.mesh.position.lerp(target, k)

      const top = item.mesh.material[TOP]
      const glow = item.invoked ? 0.35 + 0.25 * Math.sin(now * 6) : item.hover ? 0.15 : 0
      top.emissive.setRGB(glow * 1.0, glow * 0.75, glow * 0.3)
    })
  }
}
