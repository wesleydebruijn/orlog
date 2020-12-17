import React from 'react'
import { useParams } from 'react-router'

import { useUser } from '../../../hooks/useAuth'
import { GameProvider } from '../../../providers/GameProvider'

import { Lobby } from './components/Lobby'
import { GameBoard } from './components/Gameboard'

export default function Game() {
  const { id: gameId } = useParams<{ id: string }>()
  const { id: userId } = useUser()

  return (
    <GameProvider gameId={gameId} userId={userId}>
      {lobby => {
        if (lobby) {
          switch (lobby.status) {
            case 'playing':
              return <GameBoard />

            case 'finished':
              return <span>Hooray it is over</span>

            default:
              return <Lobby />
          }
        }
      }}
    </GameProvider>
  )
}
