import { ICONS } from "./icons"
import { continueLabel, PHASE, STEP_LABEL } from "./state"

export function iconSvg(name, className = "icon") {
  const { size, paths } = ICONS[name]
  return `<svg class="${className}" viewBox="0 0 ${size[0]} ${size[1]}" aria-hidden="true">${paths
    .map(d => `<path d="${d}"/>`)
    .join("")}</svg>`
}

export const escapeHtml = text =>
  String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c])

const LEGEND = [
  ["melee_attack", "Melee attack", "Beats melee blocks and hits for its damage when unblocked"],
  ["melee_block", "Melee block", "Cancels one melee attack"],
  ["ranged_attack", "Ranged attack", "Cancelled by ranged blocks"],
  ["ranged_block", "Ranged block", "Cancels one ranged attack"],
  ["token_steal", "Token steal", "Steals tokens from your opponent"]
]

/** The overlay on top of the 3D table: banner, nameplates, hints, favor tiers, results. */
export function createHud({ root, catalog, actions }) {
  root.innerHTML = `
    <div class="banner" data-el="banner" hidden>
      <div class="banner__phase" data-el="phase"></div>
      <div class="banner__sub" data-el="sub"></div>
    </div>

    <div class="plate plate--opp" data-el="plate-opp" hidden></div>
    <div class="plate plate--me" data-el="plate-me" hidden></div>

    <div class="flash" data-el="flash"></div>
    <div class="toast" data-el="toast" hidden></div>

    <div class="hints">
      <button class="hint" data-el="hint-continue" type="button" hidden>
        <span class="hint__key">Space</span><span data-el="hint-continue-label"></span>
      </button>
      <button class="hint" data-el="hint-help" type="button">
        <span class="hint__key">H</span><span>Help</span>
      </button>
      <button class="hint" data-el="hint-forfeit" type="button">
        <span class="hint__key">Esc</span><span>Forfeit</span>
      </button>
    </div>

    <div class="panel favor-popover" data-el="favor" hidden></div>

    <div class="modal" data-el="help" hidden>
      <div class="panel modal__panel">
        <h2>How to play</h2>
        <ol class="rules">
          <li><b>Roll.</b> Each of you rolls three times. Click dice to keep them, the rest are rolled again. Kept dice are locked in at the end of your turn.</li>
          <li><b>God favor.</b> Tokens, shown as golden dice faces, are collected. Spend them on a favor plaque for a special effect (from the second round).</li>
          <li><b>Resolution.</b> Attacks meet blocks of the same kind. Attacks that get through knock stones off your pile; steals take tokens.</li>
          <li>Out of stones? You lose.</li>
        </ol>
        <ul class="legend">
          ${LEGEND.map(
            ([icon, title, text]) =>
              `<li>${iconSvg(icon, "legend__icon")}<div><b>${title}</b><span>${text}</span></div></li>`
          ).join("")}
        </ul>
        <div class="panel__actions"><button class="btn btn--primary" data-el="help-close" type="button">Got it</button></div>
      </div>
    </div>

    <div class="modal modal--end" data-el="end" hidden>
      <div class="panel modal__panel modal__panel--end">
        <h2 data-el="end-title"></h2>
        <p data-el="end-text"></p>
        <div class="panel__actions">
          <button class="btn btn--primary" data-el="end-rematch" type="button">Rematch</button>
          <button class="btn" data-el="end-leave" type="button">Leave</button>
        </div>
      </div>
    </div>
  `

  const el = Object.fromEntries(
    [...root.querySelectorAll("[data-el]")].map(node => [node.dataset.el, node])
  )

  let model = null
  let lobby = null
  let phaseKey = null
  let flashTimer = null
  let toastTimer = null
  let openData = null

  const show = (node, visible) => (node.hidden = !visible)

  // --- hints & keyboard -------------------------------------------------------

  function doContinue() {
    if (model?.hasTurn && !model.finished) actions.continue()
  }

  function forfeit() {
    const playing = model?.active && !model.finished
    if (!playing || window.confirm("Forfeit this game and leave the table?")) actions.leave()
  }

  el["hint-continue"].addEventListener("click", doContinue)
  el["hint-help"].addEventListener("click", () => show(el.help, el.help.hidden))
  el["hint-forfeit"].addEventListener("click", forfeit)
  el["help-close"].addEventListener("click", () => show(el.help, false))
  el["end-leave"].addEventListener("click", () => actions.leave())
  el["end-rematch"].addEventListener("click", () => actions.rematch())

  window.addEventListener("keydown", event => {
    if (event.target.closest?.("input, textarea, select")) return
    if (event.code === "Space" || event.code === "Enter") {
      if (event.target.closest?.("button, a")) return
      event.preventDefault()
      doContinue()
    } else if (event.key === "h" || event.key === "H") {
      show(el.help, el.help.hidden)
    } else if (event.key === "Escape") {
      if (!el.help.hidden) show(el.help, false)
      else if (!el.favor.hidden) closeFavor()
      else forfeit()
    }
  })

  // --- pieces -------------------------------------------------------------------

  function plate(node, player, active, label) {
    node.innerHTML = `
      <div class="plate__name">${escapeHtml(player.name)}</div>
      <div class="plate__title">${escapeHtml(player.title || label)}</div>
      <div class="plate__stats">
        <span class="stat" title="Health">${iconSvg("health", "stat__icon")}<b>${player.health}</b></span>
        <span class="stat stat--tokens" title="Tokens">${iconSvg("god_favor", "stat__icon")}<b>${player.tokens}</b></span>
      </div>`
    node.classList.toggle("plate--active", active)
  }

  function flash(text) {
    el.flash.textContent = text
    el.flash.classList.remove("flash--show")
    void el.flash.offsetWidth
    el.flash.classList.add("flash--show")
    clearTimeout(flashTimer)
    flashTimer = setTimeout(() => el.flash.classList.remove("flash--show"), 1600)
  }

  function toast(text) {
    if (!text) return show(el.toast, false)
    el.toast.textContent = text
    show(el.toast, true)
  }

  function subline() {
    const mine = model.hasTurn
    switch (model.phase) {
      case PHASE.ROLL:
        return mine
          ? model.me.rolled
            ? "Click dice to keep, then end turn"
            : "Your turn to roll"
          : "Opponent is rolling"
      case PHASE.FAVOR:
        return mine ? "Pick a favor or end turn" : "Opponent is praying"
      default:
        return STEP_LABEL[model.step] || "Resolving"
    }
  }

  // --- favor tiers ----------------------------------------------------------------

  function openFavor(data) {
    const { seat, slot, favorId } = data
    const favor = catalog[favorId]
    if (!favor || !model) return

    const owner = model[seat]
    const choosing = seat === "me" && model.hasTurn && model.phase === PHASE.FAVOR
    const tiers = Object.entries(favor.tiers).sort(([a], [b]) => a - b)

    el.favor.innerHTML = `
      <button class="panel__close" data-act="close" type="button" aria-label="Close">&times;</button>
      <h3>${escapeHtml(favor.name)}</h3>
      <p class="muted">${escapeHtml(favor.description)}</p>
      <ul class="tiers">
        ${tiers
          .map(([tier, { cost, value }]) => {
            const affordable = owner.tokens >= cost
            const usable = choosing && affordable
            const text = escapeHtml(favor.tier_description.replace("{value}", value))
            return `<li><button class="tier ${usable ? "" : "tier--off"}" data-tier="${tier}" type="button" ${usable ? "" : "disabled"}>
              <span class="tier__name">Tier ${tier}</span>
              <span class="tier__text">${text}</span>
              <span class="tier__cost">${iconSvg("god_favor", "stat__icon")}${cost}</span>
            </button></li>`
          })
          .join("")}
      </ul>
      <p class="muted small">${
        choosing
          ? "Spend tokens to invoke this favor."
          : seat === "me"
            ? "You can invoke favors during your God favor turn."
            : "This is your opponent's favor."
      }</p>`

    el.favor.onclick = event => {
      const button = event.target.closest("button")
      if (!button) return
      if (button.dataset.act === "close") return closeFavor()
      if (button.dataset.tier) {
        actions.selectFavor(slot, Number(button.dataset.tier))
        closeFavor()
      }
    }
    openData = data
    show(el.favor, true)
  }

  function closeFavor() {
    openData = null
    show(el.favor, false)
  }

  // --- update ----------------------------------------------------------------------

  function update(nextLobby, nextModel) {
    lobby = nextLobby
    model = nextModel
    const playing = model.active

    show(el.banner, playing)
    show(el["plate-me"], playing)
    show(el["plate-opp"], playing)

    if (!playing) {
      show(el["hint-continue"], false)
      show(el.end, false)
      return
    }

    el.phase.textContent = `${model.phaseName} phase`
    el.sub.textContent = model.finished
      ? "The game is over"
      : `Round ${model.round} · ${model.hasTurn ? "Your turn" : "Opponent's turn"} · ${subline()}`

    plate(el["plate-me"], model.me, model.activeSeat === model.me.index && !model.finished, "You")
    plate(el["plate-opp"], model.opp, model.activeSeat === model.opp.index && !model.finished, "Opponent")

    const label = continueLabel(model)
    show(el["hint-continue"], Boolean(label))
    el["hint-continue-label"].textContent = label || ""
    el["hint-continue"].classList.toggle("hint--off", !model.hasTurn)

    const key = `${model.round}:${model.phase}`
    if (key !== phaseKey) {
      const first = phaseKey === null
      phaseKey = key
      if (!first && !model.finished) flash(`${model.phaseName} phase`)
    }

    // Keep an open tier popover in step with tokens and turns
    if (openData) openFavor(openData)

    show(el.end, model.finished)
    if (model.finished) {
      const ready = Boolean(lobby.user?.ready)
      el["end-title"].textContent = model.won ? "Victory" : "Defeat"
      el["end-text"].textContent = model.won
        ? "The Gods smile upon you. Valhalla awaits."
        : "Your opponent was favored by the Gods this time."
      el["end-rematch"].textContent = ready ? "Waiting for opponent..." : "Rematch"
      el["end-rematch"].disabled = ready
    }

  }

  return {
    update,
    openFavor,
    closeFavor,
    notify(text, ms = 2500) {
      toast(text)
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => toast(null), ms)
    }
  }
}
