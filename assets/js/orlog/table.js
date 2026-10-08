import * as THREE from "three"
import { DiceSet } from "./dice"
import { Faceoff } from "./faceoff"
import { Plaques } from "./favors"
import { layoutDice, PHASE } from "./state"
import { Stones } from "./stones"
import { Tokens } from "./tokens"
import { bowlBumpTexture, feltTextures, woodTexture } from "./textures"

const BOWL_FLOOR = 1.05
const BOWL_SCALE = 0.9
const BOWL_CENTER = new THREE.Vector3(-3, BOWL_FLOOR * BOWL_SCALE, 21)
const ROW_Z = 4.4

/** Lathe profile of a bowl, bottom centre -> outside -> rim -> inside -> floor centre */
const BOWL_PROFILE = [
  [0.01, 0],
  [6.5, 0],
  [7.5, 0.2],
  [10.8, 1.5],
  [13.2, 3.8],
  [14.4, 6.4],
  [14.5, 7.2],
  [13.6, 7.5],
  [13.0, 7.1],
  [12.8, 6.0],
  [12.0, 3.8],
  [10.6, 2.0],
  [9.0, BOWL_FLOOR],
  [0.01, BOWL_FLOOR]
].map(([x, y]) => new THREE.Vector2(x, y))

function buildBowl() {
  const map = woodTexture("#5a3818", 9).clone()
  map.repeat.set(3, 1)
  map.needsUpdate = true

  const bump = bowlBumpTexture()
  const material = new THREE.MeshStandardMaterial({
    map,
    bumpMap: bump,
    bumpScale: 2.2,
    roughness: 0.6,
    color: 0xd8c4aa,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(new THREE.LatheGeometry(BOWL_PROFILE, 72), material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.copy(BOWL_CENTER).setY(0)
  mesh.scale.setScalar(BOWL_SCALE)
  return mesh
}

function buildFelt() {
  const group = new THREE.Group()
  const { map, bump } = feltTextures()

  const felt = new THREE.Mesh(
    new THREE.PlaneGeometry(320, 240),
    new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 1.2, roughness: 1 })
  )
  felt.rotation.x = -Math.PI / 2
  felt.receiveShadow = true
  group.add(felt)

  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(330, 4, 250),
    new THREE.MeshStandardMaterial({ color: 0x1b1008, roughness: 0.9 })
  )
  slab.position.y = -2.1
  group.add(slab)
  return group
}

class Seat {
  constructor(scene, name, side, catalog) {
    this.name = name
    this.side = side

    this.group = new THREE.Group()
    this.group.rotation.y = side > 0 ? 0 : Math.PI
    scene.add(this.group)

    this.group.add(buildBowl())

    this.dice = new DiceSet(this.group, { name, side, bowl: BOWL_CENTER, rowZ: ROW_Z })
    this.stones = new Stones(this.group, {
      origin: new THREE.Vector3(-35, 0, 27),
      seed: side > 0 ? 21 : 87
    })
    this.tokens = new Tokens(this.group, {
      origin: new THREE.Vector3(30, 0, 10),
      tint: side > 0 ? 0xffffff : 0x9c6a62
    })
    this.plaques = new Plaques(this.group, {
      side,
      catalog,
      origin: new THREE.Vector3(17.6, 0, 22.2)
    })
  }

  world(local) {
    return this.group.localToWorld(local.clone())
  }

  update(dt, now) {
    this.dice.update(dt, now)
    this.stones.update(dt)
    this.tokens.update(dt)
    this.plaques.update(dt, now)
  }
}

/** The Orlog table: cloth, bowls, dice, stones, tokens and favor plaques for both players. */
export class Table {
  constructor(scene, catalog) {
    this.scene = scene
    this.catalog = catalog
    this.model = null

    scene.add(buildFelt())

    this.seats = {
      me: new Seat(scene, "me", 1, catalog),
      opp: new Seat(scene, "opp", -1, catalog)
    }
    this.faceoff = new Faceoff(scene, this)
  }

  update(model) {
    this.model = model
    const interactive = model.hasTurn && model.phase === PHASE.ROLL

    for (const [key, other] of [
      ["me", "opp"],
      ["opp", "me"]
    ]) {
      const seat = this.seats[key]
      const player = model[key]

      seat.stones.set(player.health)
      seat.tokens.set(player.tokens)
      seat.plaques.set(player.favors, model.settings.favors, player.invokedFavor, key)

      seat.dice.sync(layoutDice(model, player, model[other]), {
        rolled: player.rolled,
        fresh: player.fresh,
        dimLocked: model.phase === PHASE.ROLL,
        clickable: entry => key === "me" && interactive && player.rolled && !entry.locked
      })
    }

    this.faceoff.update(model)
  }

  frame(dt, now) {
    this.seats.me.update(dt, now)
    this.seats.opp.update(dt, now)
    this.faceoff.frame(dt, now)
  }

  /** Meshes the pointer can interact with */
  pickables() {
    return [
      ...this.seats.me.dice.meshes(),
      ...this.seats.me.plaques.meshes(),
      ...this.seats.opp.plaques.meshes()
    ]
  }

  setHover(userData) {
    for (const seat of Object.values(this.seats)) {
      seat.dice.setHover(userData?.kind === "die" && userData.seat === seat.name ? userData.id : null)
      seat.plaques.setHover(
        userData?.kind === "plaque" && userData.seat === seat.name ? userData.slot : null
      )
    }
  }

  /** Is the hovered thing something a click would do anything with? */
  clickable(userData) {
    if (!userData || !this.model) return false
    if (userData.kind === "plaque") return true
    const die = this.seats.me.dice.get(userData.id)
    return Boolean(die?.clickable)
  }
}
