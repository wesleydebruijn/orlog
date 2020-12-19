import React from 'react'
import { useParams } from 'react-router'

import { useUser } from '../../../hooks/useAuth'
import GameStateWaiting from './components/GameState/GameStateWaiting/GameStateWaiting'
import GameBoard from './components/GameBoard/GameBoard'
import GameStateFinished from './components/GameState/GameStateFinished'
import { GameProvider } from '../../../providers/GameProvider'

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const { id: userId } = useUser()

  return (
    <GameProvider gameId={gameId} userId={userId}>
      {lobby => {
        switch (lobby?.status) {
          case 'finished':
            return <GameStateFinished won={lobby.game.winner === lobby.turn} />
          case 'waiting':
            return <GameStateWaiting />
          case 'playing':
            return <GameBoard />
        }
      }}
    </GameProvider>
  )
}
