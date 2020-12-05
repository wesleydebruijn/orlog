import React, { Reducer, useReducer } from 'react'

import reducer from '../reducers/auth'
import type { Action, AuthState } from '../reducers/auth'

export type AuthContext = {
  state: AuthState
  dispatch: (action: Action) => void
}

const initialState: AuthState = {
  user: undefined
}

export const Context = React.createContext<AuthContext>({
  state: initialState,
  dispatch: () => {}
})

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // TODO: correctly type
  // @ts-ignore
  const [state, dispatch] = useReducer<Reducer<AuthState, Action>>(reducer, initialState)
  const contextValue = { state, dispatch }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
