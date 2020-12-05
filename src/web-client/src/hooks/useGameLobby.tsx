import { useParams } from 'react-router'
import useWebSocket from 'react-use-websocket'

import { getUserId } from '../helpers/identifiers'
import { useGameState } from './useGameState'

export function useGameLobby() {
  const { gameId } = useParams<{ gameId: string }>()
  const userId = getUserId()
  const socketUrl = `ws://localhost:4000/ws/${gameId}/${userId}`

  const { state, nextState } = useGameState()

  useWebSocket(socketUrl, {
    shouldReconnect: closeEvent => {
      // todo: dont reconnect on full lobby
      return true
    },
    onMessage: event => {
      if (!event.data) return

      nextState(JSON.parse(event.data))
    }
  })

  return {
    state
  }
}
