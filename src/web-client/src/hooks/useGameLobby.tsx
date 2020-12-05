import { useParams } from 'react-router'
import useWebSocket from 'react-use-websocket'

import { useUser } from './useAuth'
import { useGameState } from './useGameState'

export function useGameLobby() {
  const { gameId } = useParams<{ gameId: string }>()
  const user = useUser()
  const socketUrl = `ws://localhost:4000/ws/${gameId}/${user.id}`

  const { state, nextState } = useGameState()

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => {
      // todo: dont reconnect on full lobby
      return true
    },
    onMessage: (event: { data: string }) => {
      if (!event.data) return

      nextState(JSON.parse(event.data))
    }
  })

  const doContinue = () =>
    sendJsonMessage({
      type: 'continue'
    })

  const toggleDice = (index: string) =>
    sendJsonMessage({
      type: 'toggleDice',
      value: parseInt(index)
    })

  return {
    doContinue,
    toggleDice,
    state
  }
}
