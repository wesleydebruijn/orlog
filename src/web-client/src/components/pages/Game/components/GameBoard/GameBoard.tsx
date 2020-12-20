import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { animated } from 'react-spring'

import { useGame } from '../../../../../hooks/useGame'
import { usePlayer } from '../../../../../hooks/usePlayer'

import { PlayerProvider } from '../../../../../providers/PlayerProvider'

import { GameTopbar } from '../../../../shared/Topbar/GameTopBar'
import { PlayerCard } from '../PlayerCard/PlayerCard'
import { FavorCard, Tier } from '../FavorCard/FavorCard'
import ContinueButton from '../ContinueButton/ContinueButton'

import './GameBoard.scss'
import { useDiceTransitions } from '../../../../../hooks/useDiceTransitions'
import { PhaseId } from '../../../../../types/types'
import { AnimatedDice, Dice } from '../Dice/Dice'
import { faceOffDices, getDiceType, sortByDefence, sortByOffense } from '../../../../../utils/dice'

export default function GameBoard() {
  const { player, opponent, phase, actions } = useGame()

  return (
    <section className="game-board">
      <GameTopbar title={`${phase.name} phase`} />
      <section className="game-board__field">
        <div className="game-board__field-bg">
          <PlayerProvider player={opponent} opponent={player}>
            <PlayerArea />
          </PlayerProvider>
          <PlayerProvider player={player} opponent={opponent}>
            <PlayerArea />
          </PlayerProvider>
          <ContinueButton onClick={() => actions.doContinue()} />
        </div>
      </section>
    </section>
  )
}

export function PlayerArea() {
  const { player, self } = usePlayer()

  const classes = classNames('player-area', {
    'player-area--self': self
  })

  return (
    <section className={classes}>
      <div className="wrapper wrapper--flex">
        <PlayerCard
          name={player.user.name}
          title={player.user.title}
          health={player.health}
          tokens={player.tokens}
        />
        <FavorArea />
      </div>
      <DiceArea />
    </section>
  )
}

export function FavorArea() {
  const { favors } = usePlayer()
  const [favor, setFavor] = useState(0)
  const {
    actions: { selectFavor }
  } = useGame()

  function toggleFavor(index: number) {
    favor === index ? setFavor(0) : setFavor(index)
  }

  return (
    <section className="favor-area">
      {favors.map(({ name, description, tiers, tier_description }, index) => (
        <FavorCard
          key={name}
          index={index + 1}
          active={index + 1 === favor}
          name={name}
          description={description}
          open={toggleFavor}
        >
          {Object.values(tiers).map((tier, tierIndex) => (
            <Tier
              key={tierIndex}
              description={tier_description}
              cost={tier.cost}
              value={tier.value}
              onClick={() => selectFavor(index + 1, tierIndex + 1)}
            />
          ))}
        </FavorCard>
      ))}
    </section>
  )
}

function addDiceIndex(dice: any, index: number) {
  return { ...dice, index: index + 1 }
}

export function DiceArea() {
  const { started, self, player, opponent } = usePlayer()
  const { phase } = useGame()

  const [dices, setDices] = useState(Object.values(player.dices).map(addDiceIndex))
  const faceOff = phase.id > PhaseId.Roll

  const { transitions, containerStyle, diceStyle } = useDiceTransitions(dices, faceOff)

  useEffect(() => {
    if (faceOff) {
      setDices(
        faceOffDices(Object.values(player.dices), Object.values(opponent.dices))
          .map(addDiceIndex)
          .sort(started ? sortByOffense : sortByDefence)
      )
    } else {
      setDices(Object.values(player.dices).map(addDiceIndex))
    }
  }, [player.dices, faceOff])

  return (
    <>
      <div className="dice-area">
        <div className="dice-area__container" style={containerStyle}>
          {transitions.map(({ item, props, key }, index) => (
            <AnimatedDice
              key={key}
              style={diceStyle(props, index)}
              value={getDiceType(item)}
              hasTokens={item.tokens > 0}
              onClick={undefined}
              locked={item.locked}
              hidden={item.placeholder}
              selected={item.keep}
              self={self}
              rolled={player.rolled}
            />
          ))}
        </div>
      </div>
    </>
  )
}
