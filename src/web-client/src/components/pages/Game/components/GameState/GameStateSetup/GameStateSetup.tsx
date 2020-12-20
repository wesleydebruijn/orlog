import React, { useState } from 'react'
import { useData } from '../../../../../../hooks/useData'
import type { Player } from '../../../../../../types/types'
import Button from '../../../../../shared/Button/Button'
import ContentBox from '../../../../../shared/ContentBox/ContentBox'
import { GameTopbar } from '../../../../../shared/Topbar/GameTopBar'
import { FavorCard } from '../../FavorCard/FavorCard'
import { PlayerCard } from '../../PlayerCard/PlayerCard'

import './GameStateSetup.scss'

type Props = {
  onSetup: (favors: number[]) => void
  maxFavors: number
  player: Player
  opponent: Player
}

export default function GameStateSetup({ onSetup, maxFavors, player, opponent }: Props) {
  const [selectedFavors, setSelectedFavors] = useState<number[]>([])
  const { favors } = useData()

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
    }

    if (selectedFavors.length < maxFavors) {
      const confirmation = window.confirm(
        'You have not selected the maximum number of favors, are you sure you want to continue?'
      )

      if (confirmation) {
        onSetup(selectedFavors)
      }
    }
  }

  return (
    <div className="game-state-setup">
      <GameTopbar title="Setup" />
      <main>
        <div className="game-state-setup__standoff">
          <PlayerCard name={player.user.name} title={player.user.title} />
          <h1>VS</h1>
          <PlayerCard name={opponent.user.name} title={opponent.user.title} />
        </div>
        <ContentBox title="Choose favors">
          <p>
            You may select up to{' '}
            <b>
              <u>{maxFavors}</u>
            </b>{' '}
            favors.
          </p>
          <div className="game-state-setup__favors">
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
        </ContentBox>
      </main>
    </div>
  )
}
