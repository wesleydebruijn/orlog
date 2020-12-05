import { Action } from '../reducers/gameLobby'

export type GameLobbyContext = {
  state: GameLobby
  dispatch: (action: Action) => void
}

export type GameLobby = {
  uuid?: string
  status: 'connecting' | 'waiting' | 'playing'
  settings: Settings
  turn: number
  game: Game
}

export type Settings = {
  dices: number
  favors: number
  health: number
  tokens: number
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

export const initialGameLobbyState: GameLobby = {
  status: 'connecting',
  turn: 0,
  settings: {
    dices: 0,
    favors: 0,
    health: 0,
    tokens: 0
  },
  game: {
    round: 0,
    phase: 0,
    turn: 0,
    settings: {
      dices: 0,
      favors: 0,
      health: 0,
      tokens: 0
    },
    players: {}
  }
}
