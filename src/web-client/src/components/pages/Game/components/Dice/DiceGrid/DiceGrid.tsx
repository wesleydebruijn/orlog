import React from 'react'
import { Dice as DiceProps } from '../../../../../../types/types'
import Dice from '../Dice'

import './DiceGrid.scss'

type Props = {
  dices: {
    [index: number]: DiceProps
  }
  rolled: boolean
  onToggleDice?: (index: string) => void
}

export default function DiceGrid({ dices, rolled, onToggleDice }: Props) {
  return (
    <div className="dice-grid">
      {Object.entries(dices).map(([index, dice]) => (
        <Dice key={index} {...dice} index={index} rolled={rolled} onClick={onToggleDice} />
      ))}
    </div>
  )
}
