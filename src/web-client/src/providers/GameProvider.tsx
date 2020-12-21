import React from 'react'
import { useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { isEqual } from 'lodash'

import { ChangeSettingsData, GameActions, GameLobby } from '../types/types'

type State = {
  lobby?: GameLobby
  actions?: GameActions
}

export const GameContext = React.createContext<State>({ lobby: undefined, actions: undefined })

type Props = {
  children: ({ lobby, actions }: { lobby: GameLobby; actions: GameActions }) => React.ReactNode
  gameId: string
  userId: string
}

export function GameProvider({ children, gameId, userId }: Props) {
  const socketUrl = `${process.env.REACT_APP_WS_URL}/${gameId}/${userId}`
  const [lobby, setLobby] = useState<GameLobby>()
  console.log(lobby)

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => {
      // todo: dont reconnect on full lobby
      return true
    },
    onMessage: async (event: { data: string }) => {
      if (!event.data) return

      const data = await JSON.parse(event.data)
      if (!isEqual(lobby, data)) {
        setLobby(data)
      }
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
      }),
    changeSettings: (settings: ChangeSettingsData) =>
      sendJsonMessage({
        type: 'changeSettings',
        value: settings
      }),
    setFavors: (favors: number[]) =>
      sendJsonMessage({
        type: 'setFavors',
        value: favors
      })
  }

  if (lobby !== undefined && actions !== undefined) {
    return (
      <GameContext.Provider value={{ lobby, actions }}>
        {children({ lobby, actions })}
      </GameContext.Provider>
    )
  }

  return null
}
