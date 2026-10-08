// Turns the raw Game.Lobby JSON into a view model for the table, and ports the dice
// ordering helpers of the former React client (utils/dice.ts).

export const PHASE = { ROLL: 1, FAVOR: 2, RESOLUTION: 3 }

// Resolution is stepped through by the player's remaining `turns` (see Game.Phase.Resolution)
export const STEP = {
  PRE_OPPONENT: 7,
  PRE_PLAYER: 6,
  RESOLVE: 5,
  ATTACK: 4,
  STEAL: 3,
  POST_OPPONENT: 2,
  POST_PLAYER: 1
}

export const STEP_LABEL = {
  7: "Gods favor the challenger",
  6: "Gods favor the challenged",
  5: "Dice clash",
  4: "Attack",
  3: "Token steal",
  2: "Gods answer the challenger",
  1: "Gods answer the challenged"
}

// --- dice helpers ------------------------------------------------------------

const OFFENSE = {
  "melee-attack": 1,
  "ranged-attack": 2,
  "melee-block": 3,
  "ranged-block": 4,
  "token-steal": 5,
  "token-block": 6
}

const DEFENSE = {
  "melee-block": 1,
  "ranged-block": 2,
  "melee-attack": 3,
  "ranged-attack": 4,
  "token-block": 5,
  "token-steal": 6
}

export const diceType = dice => `${dice.face.type}-${dice.face.stance}`

const opposingType = dice =>
  `${dice.face.type}-${dice.face.stance === "block" ? "attack" : "block"}`

const sortByOffense = (a, b) => OFFENSE[diceType(a)] - OFFENSE[diceType(b)]
const sortByDefence = (a, b) => DEFENSE[diceType(a)] - DEFENSE[diceType(b)]

function placeholder(type) {
  const [faceType, stance] = type.split("-")
  return {
    id: null,
    placeholder: true,
    locked: true,
    keep: true,
    tokens: 0,
    face: { type: faceType, stance, count: 0, amount: 0, intersects: 0, disabled: false }
  }
}

/**
 * Own dice plus invisible placeholders for every opposing die the other player has
 * no counterpart for, so that both rows line up column by column.
 */
export function faceOffRow(dices, otherDices, started) {
  const required = otherDices.reduce((acc, dice) => {
    const type = opposingType(dice)
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const row = [...dices]
  for (const [type, count] of Object.entries(required)) {
    const missing = count - dices.filter(dice => diceType(dice) === type).length
    for (let i = 0; i < missing; i++) row.push(placeholder(type))
  }

  let nextId = dices.length
  row.forEach(dice => {
    if (dice.placeholder) dice.id = `placeholder-${++nextId}`
  })

  return row.sort(started ? sortByOffense : sortByDefence)
}

/** Number of hits a die lands, after the dice clash (see Game.Dice.Face.hits/1) */
export function hits(dice) {
  const { face } = dice
  if (face.disabled) return 0
  return face.stance === "block" ? face.intersects : face.count - face.intersects
}

// --- view model --------------------------------------------------------------

function sortedValues(map) {
  return Object.entries(map || {})
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, value]) => ({ key: Number(key), value }))
}

function blankDice(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    placeholder: false,
    locked: false,
    keep: false,
    tokens: 0,
    face: { type: "melee", stance: "block", count: 1, amount: 1, intersects: 0, disabled: false }
  }))
}

function playerModel(lobby, settings, index, self, active) {
  const game = lobby.game
  const player = game.players?.[index]
  const user = self ? lobby.user : lobby.users?.find(u => u.name !== lobby.user?.name)

  if (!active || !player) {
    return {
      index,
      self,
      name: user?.name ?? (self ? "You" : "Waiting for player..."),
      title: user?.title ?? "",
      health: settings.health,
      tokens: settings.tokens,
      turns: 0,
      rolled: false,
      fresh: true,
      started: false,
      invokedFavor: 0,
      favors: (user?.favors ?? []).slice(0, settings.favors),
      dice: blankDice(settings.dices)
    }
  }

  const phase = game.settings.phases[game.phase]

  return {
    index,
    self,
    name: player.user.name,
    title: player.user.title,
    health: player.health,
    tokens: player.tokens,
    turns: player.turns,
    rolled: player.rolled,
    fresh: game.phase === PHASE.ROLL && !player.rolled && player.turns === phase.turns,
    started: game.start === index,
    invokedFavor: player.invoked_favor,
    favors: sortedValues(player.favors).map(({ value }) => value || 0),
    dice: sortedValues(player.dices).map(({ key, value }) => ({
      id: key,
      placeholder: false,
      locked: value.locked,
      keep: value.keep,
      tokens: value.tokens,
      face: value.face
    }))
  }
}

export function buildModel(lobby, preview = null) {
  const settings = { ...lobby.settings, ...(preview?.settings || {}) }
  const game = lobby.game
  const players = game?.players ?? {}
  const active =
    (lobby.status === "playing" || lobby.status === "finished") && Object.keys(players).length === 2

  const meIndex = lobby.turn > 0 ? lobby.turn : 1
  const oppIndex = meIndex === 1 ? 2 : 1

  const me = playerModel(lobby, settings, meIndex, true, active)
  const opp = playerModel(lobby, settings, oppIndex, false, active)
  if (!active && preview?.favors) me.favors = preview.favors.slice(0, settings.favors)

  const phaseDef = active ? game.settings.phases[game.phase] : null
  const acting = active ? players[game.turn] : null

  return {
    status: lobby.status,
    active,
    settings,
    me,
    opp,
    round: game?.round ?? 0,
    phase: active ? game.phase : 0,
    phaseName: phaseDef?.name ?? "",
    auto: phaseDef?.auto ?? false,
    activeSeat: active ? game.turn : 0,
    step: active && game.phase === PHASE.RESOLUTION ? acting.turns : 0,
    hasTurn: active && lobby.status === "playing" && game.turn === meIndex,
    finished: lobby.status === "finished",
    winner: game?.winner ?? 0,
    won: game?.winner === meIndex,
    seated: lobby.turn > 0
  }
}

/**
 * Which dice go in the row between the bowls, which wait in the staging spot beside the
 * bowl and which stay in the bowl.
 * During the roll phase only locked dice (committed at the end of a turn) are in the row;
 * a die that is marked to keep moves out of the bowl to the stage until it is locked or
 * unmarked. Afterwards every die faces off against the opposing die. `kind` tells the
 * two layouts apart.
 */
export function layoutDice(model, seat, other) {
  if (!model.active || model.phase === PHASE.ROLL) {
    return {
      kind: "roll",
      row: seat.dice.filter(dice => dice.locked),
      stage: seat.dice.filter(dice => dice.keep && !dice.locked),
      bowl: seat.dice.filter(dice => !dice.keep && !dice.locked)
    }
  }

  return {
    kind: "faceoff",
    row: faceOffRow(seat.dice, other.dice, seat.started),
    stage: [],
    bowl: []
  }
}

export function continueLabel(model) {
  if (!model.active || model.finished) return null

  switch (model.phase) {
    case PHASE.ROLL: {
      const rollable = !model.me.rolled && model.me.dice.some(dice => !dice.locked)
      return rollable ? "Roll dice" : "End turn"
    }
    case PHASE.FAVOR:
      return "End turn"
    default:
      return "Speed up resolution"
  }
}
