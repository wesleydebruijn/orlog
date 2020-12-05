import React, { Reducer, useReducer } from 'react'

import reducer, { Action } from '../reducers/gameLobby'
import { GameLobby, GameLobbyContext, initialGameLobbyState } from '../types/types'

export const Context = React.createContext<GameLobbyContext>({
  state: initialGameLobbyState,
  dispatch: () => {}
})

type GameLobbyProviderProps = {
  children: React.ReactNode
}

export function GameLobbyProvider({ children }: GameLobbyProviderProps) {
  // @ts-ignore
  const [state, dispatch] = useReducer<Reducer<GameLobby, Action>>(reducer, initialGameLobbyState)
  const contextValue = { state, dispatch }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
