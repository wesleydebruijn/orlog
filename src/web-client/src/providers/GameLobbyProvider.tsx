import React, { Reducer, useReducer } from 'react'

import reducer, { Action } from '../reducers/gameLobby'
import { GameState, GameContext, initialState } from '../types/types'

export const Context = React.createContext<GameContext>({
  state: initialState,
  dispatch: () => {}
})

type GameProviderProps = {
  children: React.ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  // @ts-ignore
  const [state, dispatch] = useReducer<Reducer<GameState, Action>>(reducer, initialState)
  const contextValue = { state, dispatch }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
