import React, { useState } from 'react'
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
  onSetup: (user: Partial<User>) => void
  maxFavors: number
  player: User
  opponent: User
}

export default function GameStateWaiting({ onSetup, maxFavors, player, opponent }: Props) {
  const [selectedFavors, setSelectedFavors] = useState<number[]>([])
  const { favors } = useData()
  const opponentCard =
    opponent !== undefined ? (
      <PlayerCard name={opponent.name} title={opponent.title} />
    ) : (
      <PlayerCard name="Waiting for player..." title="" avatar={<LoaderIcon />} placeholder />
    )

  function selectFavor(index: number) {
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
      }
    } else {
      onSetup({ favors: selectedFavors })
    }
  }

  return (
    <div className="game-state-waiting">
      <GameTopbar title="Setup" />
      <main>
        <div className="game-state-waiting__standoff">
          <PlayerCard name={player.name} title={player.title} />
          <h1>VS</h1>
          {opponentCard}
        </div>
        <ContentBox title="Choose favors">
          <p>
            You may select up to{' '}
            <b>
              <u>{maxFavors}</u>
            </b>{' '}
            favors.
          </p>
          {player.favors.length > 0 ? (
            <h2>Waiting for opponent to finish setup</h2>
          ) : (
            <>
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
              <Button onClick={() => confirmSetup()}>Confirm</Button>
            </>
          )}
        </ContentBox>
      </main>
    </div>
  )
}
