import React from 'react'
import { useParams } from 'react-router'

import { useUser } from '../../../hooks/useAuth'
import GameStateWaiting from './components/GameState/GameStateWaiting/GameStateWaiting'
import GameBoard from './components/GameBoard/GameBoard'
import GameStateFinished from './components/GameState/GameStateFinished'
import { GameProvider } from '../../../providers/GameProvider'
import GameStateCreating from './components/GameState/GameStateCreating/GameStateCreating'
import GameStateSetup from './components/GameState/GameStateSetup/GameStateSetup'

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const { id: userId } = useUser()

  return (
    <GameProvider gameId={gameId} userId={userId}>
      {({ lobby, actions }) => {
        switch (lobby.status) {
          case 'creating':
            return <GameStateCreating onCreate={actions.changeSettings} settings={lobby.settings} />

          case 'setup':
            return (
              <GameStateSetup
                onSetup={actions.setFavors}
                maxFavors={lobby.settings.favors}
                player={lobby.game.players[1]}
                opponent={lobby.game.players[2]}
              />
            )

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
