import { GameState, Favor, GameLobby } from '../types/types'

export const NEXT_STATE = 'NEXT_STATE'
export const SET_FAVORS = 'SET_FAVORS'

type NextState = {
  type: typeof NEXT_STATE
  payload: {
    data: GameLobby
  }
}

type SetFavors = {
  type: typeof SET_FAVORS
  payload: {
    data: {
      [index: number]: Favor
    }
  }
}

export type Action = NextState | SetFavors

export default function GameReducer(state: GameState, action: Action) {
  switch (action.type) {
    case NEXT_STATE:
      return { ...state, lobby: action.payload.data }
    case SET_FAVORS:
      return { ...state, favors: action.payload.data }
  }
}
