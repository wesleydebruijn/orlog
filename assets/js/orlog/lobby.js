import { escapeHtml, iconSvg } from "./hud"

const DEFAULTS = { dices: 6, health: 15, tokens: 0, favors: 3 }

const SLIDERS = [
  { key: "dices", label: "Dice", min: 2, max: 8 },
  { key: "health", label: "Health", min: 5, max: 30 },
  { key: "tokens", label: "Starting tokens", min: 0, max: 10 },
  { key: "favors", label: "God favors", min: 1, max: 5 }
]

/**
 * Screens shown over the table while the game isn't running yet: connecting, game
 * creation, favor selection and inviting a friend.
 */
export function createLobbyUi({ root, catalog, gameId, actions, onPreview }) {
  let connection = "connecting"
  let lobby = null
  let custom = false
  let draft = { ...DEFAULTS }
  let selected = null // favors picked in the waiting room, null until initialised
  let notice = ""
  let confirmFewer = false
  let lastScreen = null

  const link = `${location.origin}/game/${gameId}`

  function panel(title, body, extra = "") {
    root.hidden = false
    root.innerHTML = `<div class="panel lobby ${extra}"><h2>${title}</h2>${body}</div>`
  }

  function hide() {
    root.hidden = true
    root.innerHTML = ""
    lastScreen = null
  }

  // --- screens ---------------------------------------------------------------------

  function renderConnection() {
    if (connection === "full") {
      return panel(
        "This table is full",
        `<p>Two players are already at this table. Start your own game instead.</p>
         <div class="panel__actions"><a class="btn btn--primary" href="/">Back to menu</a></div>`
      )
    }
    return panel(
      connection === "reconnecting" ? "Reconnecting..." : "Taking a seat...",
      `<div class="spinner"></div>`,
      "lobby--small"
    )
  }

  function renderCreating() {
    const me = lobby.user
    const host = !lobby.users.length || lobby.users[0].name === me?.name
    if (!host) {
      return panel(
        "Setting the table",
        `<p>The host is choosing the rules for this game...</p><div class="spinner"></div>`,
        "lobby--small"
      )
    }

    if (!custom) {
      onPreview({ settings: {} })
      return panel(
        "Create game",
        `<div class="choices">
          <div class="choice">
            <h3>Default</h3>
            <p>The Orlog you know from Assassin's Creed Valhalla.</p>
            <button class="btn btn--primary" data-act="create-default" type="button">Create default</button>
          </div>
          <div class="choice">
            <h3>Custom</h3>
            <p>Change the number of dice, health, tokens and favors.</p>
            <button class="btn" data-act="custom" type="button">Create custom</button>
          </div>
        </div>`
      )
    }

    panel(
      "Custom game",
      `${SLIDERS.map(
        ({ key, label, min, max }) => `
          <label class="slider">
            <span>${label}<b data-value="${key}">${draft[key]}</b></span>
            <input type="range" data-slider="${key}" min="${min}" max="${max}" value="${draft[key]}" />
          </label>`
      ).join("")}
       <div class="panel__actions">
         <button class="btn" data-act="cancel" type="button">Cancel</button>
         <button class="btn btn--primary" data-act="create-custom" type="button">Create game</button>
       </div>`
    )
    onPreview({ settings: draft })
  }

  function favorCard(id) {
    const favor = catalog[id]
    const costs = Object.values(favor.tiers)
      .map(tier => tier.cost)
      .join(" / ")
    return `<button class="favor ${selected.includes(id) ? "favor--on" : ""}" data-favor="${id}" type="button" ${lobby.user.ready ? "disabled" : ""}>
      ${iconSvg("god_favor", "favor__icon")}
      <b>${escapeHtml(favor.name)}</b>
      <span>${escapeHtml(favor.description)}</span>
      <small>${costs} tokens</small>
    </button>`
  }

  function playerCard(user, placeholder = false) {
    if (placeholder) {
      return `<div class="seat seat--empty"><div class="spinner spinner--small"></div><b>Waiting for player...</b></div>`
    }
    return `<div class="seat ${user.ready ? "seat--ready" : ""}">
      <b>${escapeHtml(user.name)}</b><span>${escapeHtml(user.title)}</span>
      <em>${user.ready ? "Ready" : "Choosing favors"}</em>
    </div>`
  }

  function renderWaiting() {
    const me = lobby.user
    if (selected === null) selected = [...(me.favors || [])]
    const max = lobby.settings.favors
    const others = lobby.users.filter(user => user.name !== me.name)
    const scroll = root.querySelector(".favors")?.scrollTop ?? 0

    panel(
      "Setup",
      `<div class="standoff">
        ${playerCard(me)}
        <span class="standoff__vs">VS</span>
        ${others[0] ? playerCard(others[0]) : playerCard(null, true)}
      </div>

      <h3>Choose your favors <small>${selected.length} / ${max}</small></h3>
      <div class="favors">${Object.keys(catalog)
        .map(id => favorCard(Number(id)))
        .join("")}</div>
      ${notice ? `<p class="notice">${escapeHtml(notice)}</p>` : ""}
      <div class="panel__actions">
        ${
          me.ready
            ? `<button class="btn" data-act="unready" type="button">Change setup</button>`
            : `<button class="btn btn--primary" data-act="confirm" type="button">Confirm</button>`
        }
      </div>

      <h3>Invite a friend</h3>
      <div class="invite">
        <input type="text" readonly value="${escapeHtml(link)}" data-el="link" />
        <button class="btn" data-act="copy" type="button">Copy</button>
        ${navigator.share ? `<button class="btn" data-act="share" type="button">Share</button>` : ""}
      </div>`,
      "lobby--wide"
    )

    const list = root.querySelector(".favors")
    if (list) list.scrollTop = scroll
    onPreview({ favors: selected, settings: {} })
  }

  // --- rendering ----------------------------------------------------------------------

  function render() {
    if (connection !== "open" || !lobby) {
      lastScreen = "connection"
      return renderConnection()
    }

    if (lobby.status === "creating") {
      lastScreen = "creating"
      return renderCreating()
    }

    if (lobby.status === "waiting") {
      lastScreen = "waiting"
      return renderWaiting()
    }

    hide()
  }

  // --- events ------------------------------------------------------------------------------

  root.addEventListener("click", async event => {
    const button = event.target.closest("button[data-act], button[data-favor]")
    if (!button) return

    if (button.dataset.favor) {
      const id = Number(button.dataset.favor)
      const max = lobby.settings.favors
      notice = ""
      confirmFewer = false
      if (selected.includes(id)) selected = selected.filter(favor => favor !== id)
      else selected = [...selected, id].slice(-max)
      return render()
    }

    switch (button.dataset.act) {
      case "create-default":
        return actions.changeSettings({})
      case "custom":
        custom = true
        return render()
      case "cancel":
        custom = false
        return render()
      case "create-custom":
        return actions.changeSettings(draft)
      case "confirm": {
        const max = lobby.settings.favors
        if (selected.length === 0) {
          notice = "Pick at least one God favor."
          confirmFewer = false
          return render()
        }
        if (selected.length < max && !confirmFewer) {
          notice = `You can pick ${max}. Press Confirm again to continue with ${selected.length}.`
          confirmFewer = true
          return render()
        }
        notice = ""
        confirmFewer = false
        actions.updateUser({ favors: selected })
        return actions.toggleReady()
      }
      case "unready":
        return actions.toggleReady()
      case "copy": {
        const input = root.querySelector('[data-el="link"]')
        try {
          await navigator.clipboard.writeText(link)
        } catch {
          input.select()
          document.execCommand("copy")
        }
        button.textContent = "Copied"
        return setTimeout(() => (button.textContent = "Copy"), 1500)
      }
      case "share":
        return navigator
          .share({
            url: link,
            title: "You've been challenged to a game of Orlog!",
            text: "The Viking dice game from Assassin's Creed Valhalla"
          })
          .catch(() => {})
    }
  })

  root.addEventListener("input", event => {
    const key = event.target.dataset?.slider
    if (!key) return
    draft = { ...draft, [key]: Number(event.target.value) }
    root.querySelector(`[data-value="${key}"]`).textContent = draft[key]
    onPreview({ settings: draft })
  })

  return {
    update(nextLobby) {
      const previousStatus = lobby?.status
      lobby = nextLobby
      if (previousStatus !== lobby.status && lobby.status !== "waiting") selected = null
      render()
    },
    setConnection(status) {
      connection = status
      render()
    }
  }
}
