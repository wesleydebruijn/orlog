import React, { useEffect, useState } from 'react'
import classNames from 'classnames'

import { useGame } from '../../../../../hooks/useGame'
import { usePlayer } from '../../../../../hooks/usePlayer'
import { useDiceTransitions } from '../../../../../hooks/useDiceTransitions'
import { useBoolean } from '../../../../../hooks/useBoolean'
import { PlayerProvider } from '../../../../../providers/PlayerProvider'
import { PhaseId } from '../../../../../types/types'

import {
  addDiceIndex,
  faceOffDices,
  getDiceType,
  sortByDefence,
  sortByOffense
} from '../../../../../utils/dice'

import { GameTopbar } from '../../../../shared/Topbar/GameTopBar'
import { PlayerCard } from '../PlayerCard/PlayerCard'
import { FavorCard, Tier } from '../FavorCard/FavorCard'
import { GameOverlay } from '../GameOverlay/GameOverlay'
import { AnimatedDice } from '../Dice/Dice'
import ContinueButton from '../ContinueButton/ContinueButton'

import './GameBoard.scss'

export default function GameBoard() {
  const { player, opponent, phase, round, status, won, actions } = useGame()
  const [phaseTransition, setPhaseTransition] = useBoolean(1000)

  useEffect(() => setPhaseTransition(true), [phase.id])

  return (
    <section className="game-board">
      <GameOverlay active={status === 'playing' && phaseTransition}>{phase.name} phase</GameOverlay>
      <GameOverlay active={status === 'finished'}>{won ? 'You won!' : 'You lost!'}</GameOverlay>
      <GameTopbar title={`${phase.name} phase`} subtitle={`Round ${round}`} />
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
  const { hasTurn, phase, actions } = useGame()
  const { self, favors, player } = usePlayer()

  const [activeFavor, setActiveFavor] = useState(0)
  const toggleFavor = (favor: number) =>
    favor === activeFavor ? setActiveFavor(0) : setActiveFavor(favor)
  const toggleable = self && hasTurn && phase.id === PhaseId.GodFavor

  useEffect(() => {
    toggleable ? toggleFavor(1) : toggleFavor(0)
  }, [phase.id, hasTurn])

  return (
    <section className="favor-area">
      {favors.map(({ name, description, tiers, tier_description }, index) => (
        <FavorCard
          key={name}
          index={index + 1}
          active={index + 1 === activeFavor}
          highlight={index + 1 === player.invoked_favor}
          name={name}
          description={description}
          onClick={toggleable ? toggleFavor : undefined}
        >
          {Object.values(tiers).map((tier, tierIndex) => (
            <Tier
              key={tierIndex}
              description={tier_description}
              cost={tier.cost}
              value={tier.value}
              active={player.tokens >= tier.cost}
              onClick={() => actions.selectFavor(index + 1, tierIndex + 1)}
            />
          ))}
        </FavorCard>
      ))}
    </section>
  )
}

export function DiceArea() {
  const { hasTurn, phase, actions } = useGame()
  const { started, self, player, opponent } = usePlayer()

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
  }, [player.dices, phase.id])

  return (
    <div className="dice-area">
      <div className="dice-area__container" style={containerStyle}>
        {transitions.map(({ item, props, key }, index) => (
          <AnimatedDice
            key={key}
            style={diceStyle(props, index)}
            value={getDiceType(item)}
            hasTokens={item.tokens > 0}
            onClick={
              self && hasTurn && player.rolled ? () => actions.toggleDice(index + 1) : undefined
            }
            locked={item.locked}
            hidden={item.placeholder}
            selected={item.keep}
            self={self}
            rolled={player.rolled}
          />
        ))}
      </div>
    </div>
  )
}
