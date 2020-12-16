import React from 'react'
import { useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { GameActions, GameLobby } from '../types/types'

type State = {
  status: ReadyState
  lobby?: GameLobby
  actions?: GameActions
}

export const GameContext = React.createContext<State>({ status: ReadyState.UNINSTANTIATED })

type Props = {
  children: React.ReactNode
  gameId: string
  userId: string
}

export function GameProvider({ children, gameId, userId }: Props) {
  const socketUrl = `${process.env.REACT_APP_WS_URL}/${gameId}/${userId}`
  const [lobby, setLobby] = useState<GameLobby>()

  const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => {
      // todo: dont reconnect on full lobby
      return true
    },
    onMessage: async (event: { data: string }) => {
      if (!event.data) return

      const data = await JSON.parse(event.data)
      setLobby(data)
    }
  })

  const actions = {
    doContinue: () =>
      sendJsonMessage({
        type: 'continue'
      }),
    toggleDice: (index: number) =>
      sendJsonMessage({
        type: 'toggleDice',
        value: index
      }),
    selectFavor: (favor: number, tier: number) =>
      sendJsonMessage({
        type: 'selectFavor',
        value: { favor, tier }
      })
  }

  return (
    <GameContext.Provider value={{ status: readyState, lobby, actions }}>
      {children}
    </GameContext.Provider>
  )
}
