export type GameLobby = {
  uuid?: string
  status: 'connecting' | 'waiting' | 'playing' | 'finished' | 'creating'
  settings: Settings
  user: User
  users: User[]
  turn: number
  game: Game
}

export type ChangeSettingsData = Partial<Omit<Settings, 'phases'>>
export type GameActions = {
  doContinue: () => void
  toggleDice: (diceIndex: number) => void
  selectFavor: (favor: number, tier: number) => void
  changeSettings: (settings: ChangeSettingsData) => void
  updateUser: (user: Partial<User>) => void
  toggleReady: () => void
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
  auto: boolean
}

export enum ResolutionTurn {
  PreResolutionOpponent = 7,
  PreResolutionPlayer = 6,
  ResolutionResolve = 5,
  ResolutionAttack = 4,
  ResolutionSteal = 3,
  PostResolutionOpponent = 2,
  PostResolutionPlayer = 1
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
  favors: number[]
  ready: boolean
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
  invoked_favor: number
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
