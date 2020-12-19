import React, { useEffect, useState } from 'react'
import { animated } from 'react-spring'

import { usePlayer } from '../../../../../../hooks/usePlayer'
import { useGame } from '../../../../../../hooks/useGame'
import { faceOffDices, initialDices } from './utils'
import Dice from '../Dice'

import './DiceGrid.scss'
import { PhaseId } from '../../../../../../types/types'
import { useDiceTransitions } from '../../../../../../hooks/useDiceTransitions'

type Props = {
  onToggleDice?: (index: number) => void
}

export default function DiceGrid({ onToggleDice }: Props) {
  const { started, player, opponent } = usePlayer()
  const { phase } = useGame()

  const [dices, setDices] = useState(initialDices(player))
  const faceOff = phase.id > PhaseId.Roll

  const { transitions, containerStyle, diceStyle } = useDiceTransitions(dices, faceOff)

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
        <div className="dice-grid__container" style={containerStyle}>
          {transitions.map(({ item, props, key }, index) => (
            <animated.div key={key} style={diceStyle(props, index)}>
              <Dice key={item.index} {...item} rolled={player.rolled} onClick={onToggleDice} />
            </animated.div>
          ))}
        </div>
      </div>
    </>
  )
}
