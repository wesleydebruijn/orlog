import React from 'react'

export const PlayerContext = React.createContext<{ player?: number; opponent?: number }>({
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
