import React from 'react'
import { useParams } from 'react-router'

import Button from '../../../../../shared/Button/Button'
import CategoryBox from '../../../../../shared/ContentBox/ContentBox'
import { GameTopbar } from '../../../../../shared/Topbar/GameTopBar'
import Topbar from '../../../../../shared/Topbar/Topbar'

import './GameStateWaiting.scss'

export default function GameStateWaiting() {
  const { gameId } = useParams<{ gameId: string }>()
  const link = `${process.env.REACT_APP_BASE_URL}/game/${gameId}`

  return (
    <div className="game-state-waiting">
      <GameTopbar title="Waiting for opponent..." />
      <main>
        <CategoryBox title="Invite a friend">
          <p>
            Challenge a friend, cat or dog for a game of Orlog, you can play against them and most
            likely defeat them because they probably don't know to play it yet anyway. Definitely
            your pet though.
          </p>
          <input
            type="text"
            readOnly={true}
            defaultValue={`${process.env.REACT_APP_BASE_URL}/game/${gameId}`}
          />
          <section className="game-state-waiting__actions">
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
          </section>
        </CategoryBox>
      </main>
    </div>
  )
}
