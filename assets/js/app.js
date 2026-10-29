import "../css/app.css"

import { Connection } from "./orlog/connection"
import { createBackdrop } from "./orlog/home/backdrop"
import { createEmbers } from "./orlog/home/embers"
import { createRuneDie } from "./orlog/home/rune_die"
import { createHud } from "./orlog/hud"
import { createLobbyUi } from "./orlog/lobby"
import { createPicking } from "./orlog/picking"
import { createScene } from "./orlog/scene"
import { buildModel } from "./orlog/state"
import { Table } from "./orlog/table"

const uuid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
      })

function bootHome() {
  document.getElementById("new-game").addEventListener("click", () => {
    location.href = `/game/${uuid()}`
  })

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  createBackdrop(document.getElementById("home-backdrop"), { reducedMotion })
  if (!reducedMotion) createEmbers(document.getElementById("home-embers"))

  const omen = document.getElementById("home-omen")
  createRuneDie(document.getElementById("home-die"), {
    reducedMotion,
    onLand: face => {
      omen.textContent = face.omen
      omen.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
        duration: 600,
        easing: "ease-out"
      })
    }
  })
}

// Canvas textures are drawn once and cached, so wait for the font they are lettered in
function fontsReady() {
  if (!document.fonts) return Promise.resolve()
  return document.fonts.load('700 34px "Cinzel"').catch(() => {})
}

// What the table shows before the server has told us anything
const EMPTY_LOBBY = {
  status: "creating",
  settings: { health: 15, tokens: 0, dices: 6, favors: 3 },
  user: null,
  users: [],
  turn: 0,
  game: { players: {} }
}

function bootGame(root) {
  const gameId = root.dataset.gameId
  const catalog = JSON.parse(root.dataset.favors)

  const canvas = document.getElementById("table")
  const { scene, camera, renderer, onFrame } = createScene(canvas)
  const table = new Table(scene, catalog)

  let lobby = EMPTY_LOBBY
  let preview = null

  let connection

  const hud = createHud({
    root: document.getElementById("hud"),
    catalog,
    actions: {
      continue: () => connection.continue(),
      selectFavor: (slot, tier) => connection.selectFavor(slot, tier),
      rematch: () => connection.toggleReady(),
      leave: () => {
        connection.close()
        location.href = "/"
      }
    }
  })

  const lobbyUi = createLobbyUi({
    root: document.getElementById("lobby-ui"),
    catalog,
    gameId,
    actions: {
      changeSettings: settings => connection.changeSettings(settings),
      updateUser: attrs => connection.updateUser(attrs),
      toggleReady: () => connection.toggleReady()
    },
    onPreview: next => {
      preview = next
      refresh()
    }
  })

  function refresh() {
    const model = buildModel(lobby, preview)
    table.update(model)
    hud.update(lobby, model)
  }

  createPicking({
    canvas,
    camera,
    table,
    onPick: data => {
      if (!data) return hud.closeFavor()
      if (data.kind === "plaque") hud.openFavor(data)
      else if (table.clickable(data)) connection.toggleDice(data.id)
    }
  })

  onFrame((dt, now) => table.frame(dt, now))
  refresh()

  connection = new Connection(gameId, {
    onState: state => {
      lobby = state
      if (state.status === "playing" || state.status === "finished") preview = null
      refresh()
      lobbyUi.update(state)
    },
    onStatus: status => lobbyUi.setConnection(status)
  })

  // Handy for debugging in the console
  window.orlog = { table, connection, scene, camera, renderer, get lobby() { return lobby } }
}

fontsReady().then(() => {
  const game = document.getElementById("game")
  if (game) bootGame(game)
  else if (document.getElementById("home")) bootHome()
})
