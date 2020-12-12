import React from 'react'
<<<<<<< HEAD

import { GameLobbyProvider } from '../../../providers/GameLobbyProvider'
import { useParams } from 'react-router'
import { useUser } from '../../../hooks/useAuth'
import GameStateWaiting from './components/GameState/GameStateWaiting/GameStateWaiting'
import GameBoard from './components/GameBoard/GameBoard'
import GameStateFinished from './components/GameState/GameStateFinished'

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const { id: userId } = useUser()

  return (
    <GameLobbyProvider gameId={gameId} userId={userId}>
      {({ game, status, actions }) => {
        switch (status) {
          case 'finished':
            return <GameStateFinished won={game.lobby.game.winner === game.lobby.turn} />
          case 'waiting':
            return <GameStateWaiting />
          case 'playing':
            return <GameBoard actions={actions} />
        }
      }}
    </GameLobbyProvider>
=======
import { useParams } from 'react-router'
import Button from '../../shared/Button/Button'
import ContentBox from '../../shared/ContentBox'

import { GameTopbar } from '../../shared/Topbar'

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const link = `${process.env.REACT_APP_BASE_URL}/game/${gameId}`

  return (
    <div className="bg-game-state-waiting bg-no-repeat bg-cover bg-fixed min-h-screen flex flex-col">
      <GameTopbar title="Waiting for player..." />
      <div className="container mx-auto flex justify-center items-center flex-grow -mt-64 mobile:px-12">
        <ContentBox
          className="mobile:mb-8 flex-initial min-w-f-300 text-text text-center"
          title="Invite a friend"
        >
          Challenge a friend, cat or dog for a game of Orlog, you can play against them and most
          likely defeat them because they probably don't know to play it yet anyway. Definitely your
          pet though.
          <div className="my-6 mx-auto flex flex-col">
            {'clipboard' in navigator && (
              <Button onClick={async () => await navigator.clipboard.writeText(link)}>
                Copy invite link
              </Button>
            )}
            {'share' in navigator && (
              <Button
                onClick={async () =>
                  await navigator.share({
                    url: link,
                    title: "You've been challenged to a game of Orlog!",
                    text: "The Viking dice game from Assassin's Creed Valhalla"
                  })
                }
              >
                Share
              </Button>
            )}
          </div>
        </ContentBox>
      </div>
    </div>
>>>>>>> feat: in-progress lobby screen
  )
}
