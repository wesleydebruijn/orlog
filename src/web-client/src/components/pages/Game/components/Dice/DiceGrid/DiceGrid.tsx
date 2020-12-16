import React, { useEffect, useState } from 'react'
import { useTransition, animated, interpolate } from 'react-spring'

import { usePlayer } from '../../../../../../hooks/usePlayer'
import { useGame } from '../../../../../../hooks/useGame'
import { faceOffDices, initialDices } from './utils'
import Dice from '../Dice'

import './DiceGrid.scss'
import { PhaseId } from '../../../../../../types/types'

type Props = {
  onToggleDice?: (index: number) => void
}

const DICE_WIDTH = 85
const DICE_SPACE = 15

function calculateWidth(dices: any, index: number, faceOff: boolean) {
  if (!faceOff) return DICE_WIDTH

  const dice = dices[index]
  const nextDice = dices[index + 1]

  if (
    !nextDice ||
    (dice.face.stance === nextDice.face.stance && dice.face.type === nextDice.face.type)
  ) {
    return DICE_WIDTH - DICE_SPACE
  } else {
    return DICE_WIDTH
  }
}

export default function DiceGrid({ onToggleDice }: Props) {
  const { started, player, opponent } = usePlayer()
  const { phase } = useGame()

  const [dices, setDices] = useState(initialDices(player))
  const faceOff = phase.id > PhaseId.Roll

  let width = 0
  const transitions = useTransition(
    dices.map((dice, index) => {
      const diceWidth = calculateWidth(dices, index, faceOff)

      return { ...dice, x: (width += diceWidth) - diceWidth }
    }),
    dice => dice.index,
    {
      from: { width: 0, opacity: 0 },
      leave: { width: 0, opacity: 0 },
      enter: ({ x }) => ({ x, width: DICE_WIDTH, opacity: 1 }),
      update: ({ x }) => ({ x, width: DICE_WIDTH })
    }
  )

  useEffect(() => {
    if (faceOff) {
      setDices(faceOffDices(player, opponent, started))
    } else {
      setDices(initialDices(player))
    }
  }, [player.dices, faceOff])

  return (
    <>
      <div className="dice-grid">
        <div className="dice-grid__container" style={{ width }}>
          {
            // @ts-ignore
            transitions.map(({ item, props: { x, ...rest }, key }, index) => (
              <animated.div
                key={key}
                style={{
                  zIndex: dices.length - index,
                  transform: interpolate([x], x => `translate3d(${x}px,0,0)`),
                  ...rest
                }}
              >
                <Dice key={item.index} {...item} rolled={player.rolled} onClick={onToggleDice} />
              </animated.div>
            ))
          }
        </div>
      </div>
    </>
  )
}
