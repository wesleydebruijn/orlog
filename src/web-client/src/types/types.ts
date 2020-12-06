export type InitialGameState = {
  status: 'initial'
  lobby?: GameLobby
  favors?: {
    [index: number]: Favor
  }
}

export type NewGameState = {
  status: 'new'
  lobby: GameLobby
  favors?: {
    [index: number]: Favor
  }
}

export type GameState = InitialGameState | NewGameState

export type GameLobby = {
  uuid?: string
  status: 'connecting' | 'waiting' | 'playing'
  settings: Settings
  turn: number
  game: Game
}

export type Favor = {
  name: string
  tiers: {
    [index: number]: FavorTier
  }
}

export type FavorTier = {
  cost: number
  value: number
}

export type Phases = {
  [index: number]: {
    name: string
    turns: number
    auto_turns: number
  }
}

export type Settings = {
  dices: number
  favors: number
  health: number
  tokens: number
  phases: Phases
}

export type Game = {
  round: number
  phase: number
  turn: number
  settings: Settings
  players: {
    [index: number]: Player
  }
}

export type Player = {
  uuid: string
  health: number
  tokens: number
  turns: number
  rolled: boolean
  dices: {
    [index: number]: Dice
  }
  favors: {
    [index: number]: number
  }
  // todo: favor tier needs to be other datatype in Elixir
}

export type Dice = {
  tokens: number
  locked: boolean
  keep: boolean
  face: DiceFace
}

export type DiceFace = {
  count: number
  amount: number
  intersects: number
  disabled: boolean
  type: 'melee' | 'ranged' | 'token'
  stance: 'attack' | 'block' | 'steal'
}
