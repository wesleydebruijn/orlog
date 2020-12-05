import React, { useEffect } from 'react'
import { useState } from 'react'
import useWebSocket from 'react-use-websocket'

import { GameLobby, GameState, NewGameState } from '../types/types'

export const Context = React.createContext<GameState>({
  status: 'initial'
})

type GameActions = {
  doContinue: () => void
  toggleDice: (diceIndex: string) => void
  selectFavor: (favor: number, tier: number) => void
}

type GameProviderProps = {
  children: ({
    state,
    actions
  }: {
    state: NewGameState
    actions: GameActions
    status: GameLobby['status']
  }) => React.ReactNode
  gameId: string
  userId: string
}

export function GameLobbyProvider({ children, gameId, userId }: GameProviderProps) {
  const socketUrl = `ws://localhost:4000/ws/${gameId}/${userId}`
  const [gameState, setGameState] = useState<GameState>({
    status: 'initial'
  })

  useEffect(() => {
    async function fetchFavors() {
      const response = await fetch('http://localhost:4000/favors')
      const data = await response.json()

      setGameState(prev => ({
        ...prev,
        favors: data
      }))
    }

    fetchFavors()
  }, [])

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => {
      // todo: dont reconnect on full lobby
      return true
    },
    onMessage: async (event: { data: string }) => {
      if (!event.data) return

      const data = (await JSON.parse(event.data)) as GameLobby
      console.log(data)
      setGameState(prev => ({
        ...prev,
        lobby: data,
        status: 'new'
      }))
    }
  })

  const actions = {
    doContinue: () =>
      sendJsonMessage({
        type: 'continue'
      }),
    toggleDice: (index: string) =>
      sendJsonMessage({
        type: 'toggleDice',
        value: parseInt(index)
      }),
    selectFavor: (favor: number, tier: number) =>
      sendJsonMessage({
        type: 'selectFavor',
        value: { favor, tier }
      })
  }

  if (gameState.status === 'initial') {
    return null
  } else {
    return (
      <Context.Provider value={gameState}>
        {children({ state: gameState, actions, status: gameState.lobby.status })}
      </Context.Provider>
    )
  }
}
