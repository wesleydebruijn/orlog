import React from 'react'
import { useParams } from 'react-router'

import { useUser } from '../../../hooks/useAuth'
import { GameProvider } from '../../../providers/GameProvider'

import GameBoard from './components/GameBoard/GameBoard'
import GameStateCreating from './components/GameState/GameStateCreating/GameStateCreating'
import GameStateWaiting from './components/GameState/GameStateWaiting/GameStateWaiting'

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
                user={lobby.user}
                users={lobby.users}
              />
            )

          case 'playing':
          case 'finished':
            return <GameBoard />
        }
      }}
    </GameProvider>
  )
}
