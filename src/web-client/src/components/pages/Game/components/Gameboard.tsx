import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { useGame } from '../../../../hooks/useGame'
import { usePlayer } from '../../../../hooks/usePlayer'
import { PlayerProvider } from '../../../../providers/PlayerProvider'
import { Dice, PhaseId } from '../../../../types/types'
import { getDiceType, faceOffDices, sortByOffense, sortByDefence } from '../../../../utils/dice'
import { FavorCard, Tier } from '../../../shared/FavorCard'
import { PlayerCard } from '../../../shared/PlayerCard'
import { GameTopbar } from '../../../shared/Topbar'
import { useDiceTransitions } from '../hooks/useDiceTransitions'
import { ContinueButton } from './ContinueButton'
import { AnimatedDice } from './Dice'

export function GameBoard() {
  const {
    player,
    opponent,
    phase,
    hasTurn,
    actions: { doContinue }
  } = useGame()

  return (
    <div className="bg-lightGray min-h-screen flex flex-col">
      <GameTopbar title={`${phase.name} phase`} />
      <div className="flex px-28 py-20 flex-grow">
        <div className="flex flex-col flex-grow w-full bg-gray">
          <PlayerProvider player={opponent} opponent={player}>
            <div className="flex flex-col relative justify-between flex-initial h-1/2">
              <div className="flex flex-grow justify-between">
                <Player className="-top-16 -left-16" />
                <Favors className="-top-14 left-16" />
              </div>
              <Dices />
            </div>
          </PlayerProvider>

          <ContinueButton onClick={hasTurn ? () => doContinue() : undefined} />

          <PlayerProvider player={player} opponent={opponent}>
            <div className="flex flex-col relative justify-between flex-initial h-1/2">
              <Dices />
              <div className="flex flex-grow justify-between">
                <Player className="-bottom-16 -right-16 order-2 self-end" />
                <Favors className="bottom-12 right-16 order-1 self-end" />
              </div>
            </div>
          </PlayerProvider>
        </div>
      </div>
    </div>
  )
}

export function Player({ className }: { className?: string }) {
  const { player } = usePlayer()

  return (
    <PlayerCard
      className={className}
      name={player.user.name}
      title={player.user.title}
      health={player.health}
      tokens={player.tokens}
    />
  )
}

export function Favors({ className }: { className?: string }) {
  const { favors } = usePlayer()
  const [openFavor, setOpenFavor] = useState(0)
  const {
    actions: { selectFavor }
  } = useGame()

  const classes = classNames('relative flex-initial w-80 h-20 font-signika', className)

  function toggleFavor(index: number) {
    if (openFavor === index) {
      setOpenFavor(0)
    } else {
      setOpenFavor(index)
    }
  }

  return (
    <div className={classes}>
      {favors.map(({ name, description, tiers, tier_description }, index) => (
        <FavorCard
          key={name}
          index={index + 1}
          active={index + 1 === openFavor}
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
    </div>
  )
}

function addDiceIndex(dice: Dice, index: number) {
  return { ...dice, index: index + 1 }
}

export function Dices({ className }: { className?: string }) {
  const { hasTurn, phase, actions } = useGame()
  const { self, started, player, opponent } = usePlayer()

  const [dices, setDices] = useState(Object.values(player.dices).map(addDiceIndex))
  const faceOff = phase.id > PhaseId.Roll

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

  const { transitions, containerStyle, diceStyle } = useDiceTransitions(dices, faceOff)

  const classes = classNames(
    'flex flex-initial w-2/3 h-32 justify-center items-center self-center',
    className
  )

  return (
    <div className={classes}>
      <div style={containerStyle}>
        {transitions.map(({ item, props }, index) => (
          <AnimatedDice
            style={diceStyle(props, index)}
            value={getDiceType(item)}
            hasTokens={item.tokens > 0}
            onClick={
              self && hasTurn && player.rolled ? () => actions.toggleDice(index + 1) : undefined
            }
            locked={item.locked}
            hidden={item.placeholder}
            selected={item.keep}
            rolled={player.rolled}
            self={self}
          />
        ))}
      </div>
    </div>
  )
}
