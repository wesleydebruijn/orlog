import React, { useState } from 'react'
import { useParams } from 'react-router'
import { useData } from '../../../../../../hooks/useData'
import type { User } from '../../../../../../types/types'
import Button from '../../../../../shared/Button/Button'
import ContentBox from '../../../../../shared/ContentBox/ContentBox'
import { LoaderIcon } from '../../../../../shared/Icons'
import { GameTopbar } from '../../../../../shared/Topbar/GameTopBar'
import { FavorCard } from '../../FavorCard/FavorCard'
import { PlayerCard } from '../../PlayerCard/PlayerCard'

import './GameStateWaiting.scss'

type Props = {
  toggleReady: () => void
  onSetup: (user: Partial<User>) => void
  maxFavors: number
  user: User
  users: User[]
}

export default function GameStateWaiting({ onSetup, toggleReady, maxFavors, user, users }: Props) {
  const { gameId } = useParams<{ gameId: string }>()
  const [selectedFavors, setSelectedFavors] = useState<number[]>(user.favors)
  const link = `${process.env.REACT_APP_BASE_URL}/game/${gameId}`
  const { favors } = useData()

  function selectFavor(index: number) {
    if (user.ready) {
      return
    }

    if (selectedFavors.includes(index)) {
      setSelectedFavors(selectedFavors.filter(favor => favor !== index))
    } else if (selectedFavors.length >= maxFavors) {
      const [_, ...rest] = selectedFavors
      setSelectedFavors([...rest, index])
    } else {
      setSelectedFavors([...selectedFavors, index])
    }
  }

  // @TODO: Probably more fancy method of alerts/confirms
  function confirmSetup() {
    if (selectedFavors.length === 0) {
      alert('Please select a God Favor')
    } else if (selectedFavors.length < maxFavors) {
      const confirmation = window.confirm(
        'You have not selected the maximum number of favors, are you sure you want to continue?'
      )

      if (confirmation) {
        onSetup({ favors: selectedFavors })
        toggleReady()
      }
    } else {
      onSetup({ favors: selectedFavors })
      toggleReady()
    }
  }

  return (
    <div className="game-state-waiting">
      <GameTopbar title="Setup" />
      <main>
        <div className="game-state-waiting__standoff">
          {users.length === 1 ? (
            <>
              <PlayerCard ready={user.ready} name={user.name} title={user.title} />
              <h1>VS</h1>
              <PlayerCard
                name="Waiting for player..."
                title=""
                avatar={<LoaderIcon />}
                placeholder
              />
            </>
          ) : (
            <>
              <PlayerCard ready={users[0].ready} name={users[0].name} title={users[0].title} />
              <h1>VS</h1>
              <PlayerCard ready={users[1].ready} name={users[1].name} title={users[1].title} />
            </>
          )}
        </div>
        <section className="game-state-waiting__center">
          <ContentBox title="Choose favors">
            <p>
              You may select up to{' '}
              <b>
                <u>{maxFavors}</u>
              </b>{' '}
              favors.
            </p>
            <div className="game-state-waiting__favors">
              {Object.entries(favors).map(([index, favor]) => (
                <FavorCard
                  name={favor.name}
                  index={parseInt(index)}
                  description={favor.description}
                  className={selectedFavors.includes(parseInt(index)) ? 'favor--active' : ''}
                  key={favor.name}
                  onClick={index => selectFavor(index)}
                />
              ))}
            </div>
            {!user.ready && <Button onClick={() => confirmSetup()}>Confirm</Button>}
            {user.ready && <Button onClick={() => toggleReady()}>Change setup</Button>}
          </ContentBox>
          <ContentBox title="Invite a friend">
            <p>
              Challenge a friend, cat or dog for a game of Orlog, you can play against them and most
              likely defeat them because they probably don't know to play it yet anyway. Definitely
              your pet though.
            </p>
            <section>
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
          </ContentBox>
        </section>
      </main>
    </div>
  )
}
