import { useContext } from 'react'

import { Context } from '../providers/GameLobbyProvider'
import { NEXT_STATE } from '../reducers/gameLobby'
import { GameLobby } from '../types/types'

export function useGameState() {
  const context = useContext(Context)

  if (context) {
    const { dispatch, state } = context

    return {
      nextState: (data: GameLobby) => {
        dispatch({
          type: NEXT_STATE,
          payload: { data }
        })
      },
      state
    }
  } else {
    throw new Error('Trying to access state without it existing')
  }
}
