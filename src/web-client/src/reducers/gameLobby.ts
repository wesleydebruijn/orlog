import { GameLobby } from '../types/types'

export const NEXT_STATE = 'NEXT_STATE'

type NextState = {
  type: typeof NEXT_STATE
  payload: {
    data: GameLobby
  }
}

export type Action = NextState

export default function GameReducer(state: GameLobby, action: Action) {
  switch (action.type) {
    case NEXT_STATE:
      return action.payload.data
  }
}
