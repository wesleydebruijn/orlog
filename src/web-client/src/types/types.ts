export type GameLobby = {
  uuid?: string
  status: 'connecting' | 'waiting' | 'playing' | 'finished'
  settings: Settings
  turn: number
  game: Game
}

export type GameActions = {
  doContinue: () => void
  toggleDice: (diceIndex: number) => void
  selectFavor: (favor: number, tier: number) => void
}

export type Favor = {
  name: string
  description: string
  tier_description: string
  tiers: {
    [index: number]: FavorTier
  }
}

export type FavorTier = {
  cost: number
  value: number
}

export enum PhaseId {
  Roll = 1,
  GodFavor = 2,
  Resolution = 3
}

export type Phase = {
  id: PhaseId
  name: string
  turns: number
  auto_turns: number
}

export type Settings = {
  dices: number
  favors: number
  health: number
  tokens: number
  phases: {
    [index: number]: Phase
  }
}

export type Game = {
  round: number
  phase: PhaseId
  turn: number
  start: number
  winner: number
  settings: Settings
  players: {
    [index: number]: Player
  }
}

export type User = {
  name: string
  title: string
}

export type Player = {
  user: User
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
  placeholder: boolean
  face: DiceFace
}

export type FaceType = 'melee' | 'ranged' | 'token'
export type FaceStance = 'attack' | 'block' | 'steal'

export type DiceFace = {
  count: number
  amount: number
  intersects: number
  disabled: boolean
  type: FaceType
  stance: FaceStance
}

export type DiceType =
  | 'melee-attack'
  | 'melee-block'
  | 'ranged-attack'
  | 'ranged-block'
  | 'token-steal'
