import { useState } from 'react';
import { useParams } from 'react-router';
import useWebSocket from 'react-use-websocket';

import { getUserId } from '../helpers/identifiers';
import { GameLobby, initialGameLobbyState } from '../types';

export function useGameLobby() {
  const { gameId } = useParams<{ gameId: string }>();
  const userId = getUserId();
  const socketUrl = `ws://localhost:4000/ws/${gameId}/${userId}`;

  const [state, setState] = useState<GameLobby>(initialGameLobbyState)

  const {
    sendMessage
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('you are connected mattie'),
    shouldReconnect: (closeEvent) => {
      // todo: dont reconnect on full lobby
      return true
    },
    onMessage: (event) => {
      if (!event.data) return

      setState(JSON.parse(event.data))
    }
  })

  return {
    state,
    sendMessage
  }
}
