import React from 'react'
import { useParams } from 'react-router'

import { useUser } from '../../../hooks/useAuth'
import GameBoard from './components/GameBoard/GameBoard'
import GameStateFinished from './components/GameState/GameStateFinished'
import { GameProvider } from '../../../providers/GameProvider'
import GameStateCreating from './components/GameState/GameStateCreating/GameStateCreating'
import GameStateWaiting from './components/GameState/GameStateWaiting/GameStateWaiting'
import { User } from '../../../types/types'

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const { id: userId } = useUser()

  return (
    <GameProvider gameId={gameId} userId={userId}>
      {({ lobby, actions }) => {
        switch (lobby.status) {
          case 'creating':
            return <GameStateCreating onCreate={actions.changeSettings} settings={lobby.settings} />

          case 'waiting':
            return (
              <GameStateWaiting
                toggleReady={actions.toggleReady}
                onSetup={actions.updateUser}
                maxFavors={lobby.settings.favors}
                player={Object.values(lobby.users)[0]}
                opponent={Object.values(lobby.users)[1]}
              />
            )

          case 'playing':
            return <GameBoard />

          case 'finished':
            return <GameStateFinished won={lobby.game.winner === lobby.turn} />
        }
      }}
    </GameProvider>
  )
}
