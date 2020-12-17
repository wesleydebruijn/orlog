import React from 'react'

type State = {
  player?: number
  opponent?: number
}

export const PlayerContext = React.createContext<State>({
  player: undefined,
  opponent: undefined
})

type Props = {
  children: React.ReactNode
  player: number
  opponent: number
}

export function PlayerProvider({ children, player, opponent }: Props) {
  return <PlayerContext.Provider value={{ player, opponent }}>{children}</PlayerContext.Provider>
}
