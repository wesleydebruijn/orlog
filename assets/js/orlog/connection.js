const USER_KEY = "orlog:userid"

/**
 * Stable id of this browser. `?user=<id>` overrides it, handy for playing against
 * yourself in two tabs.
 */
export function userId() {
  const override = new URLSearchParams(location.search).get("user")
  if (override && /^[A-Za-z0-9_-]{1,64}$/.test(override)) return override

  let id = localStorage.getItem(USER_KEY)
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : fallbackUuid()
    localStorage.setItem(USER_KEY, id)
  }
  return id
}

function fallbackUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const LOBBY_FULL = "Lobby is full"

/**
 * The game websocket. The server sends the full lobby state after every change; we skip
 * identical frames (it replies and broadcasts) and reconnect with backoff.
 */
export class Connection {
  constructor(gameId, { onState, onStatus }) {
    this.gameId = gameId
    this.userId = userId()
    this.onState = onState
    this.onStatus = onStatus
    this.attempt = 0
    this.last = null
    this.closed = false
    this.connect()
  }

  get url() {
    const scheme = location.protocol === "https:" ? "wss" : "ws"
    return `${scheme}://${location.host}/ws/${this.gameId}/${this.userId}`
  }

  connect() {
    this.onStatus(this.attempt === 0 ? "connecting" : "reconnecting")
    const socket = new WebSocket(this.url)
    this.socket = socket

    socket.addEventListener("open", () => {
      this.attempt = 0
      this.onStatus("open")
    })

    socket.addEventListener("message", event => {
      if (!event.data || event.data === this.last) return
      this.last = event.data
      this.onState(JSON.parse(event.data))
    })

    socket.addEventListener("close", event => {
      if (this.closed) return
      if (event.reason === LOBBY_FULL) {
        this.closed = true
        this.onStatus("full")
        return
      }
      this.onStatus("closed")
      const delay = Math.min(8000, 400 * 2 ** this.attempt++)
      setTimeout(() => this.connect(), delay)
    })
  }

  send(message) {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message))
  }

  close() {
    this.closed = true
    this.socket?.close()
  }

  // The actions the server understands (see OrlogWeb.GameSocket)
  continue() {
    this.send({ type: "continue" })
  }
  toggleDice(index) {
    this.send({ type: "toggleDice", value: index })
  }
  selectFavor(favor, tier) {
    this.send({ type: "selectFavor", value: { favor, tier } })
  }
  changeSettings(settings) {
    this.send({ type: "changeSettings", value: settings })
  }
  updateUser(attrs) {
    this.send({ type: "updateUser", value: attrs })
  }
  toggleReady() {
    this.send({ type: "toggleReady" })
  }
}
