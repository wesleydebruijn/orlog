import React from 'react'
import Dice from '../Dice'

import './DiceGrid.scss'

export default function DiceGrid() {
  return (
    <div className="dice-grid">
      <Dice
        tokens={0}
        keep={false}
        index="1"
        locked={false}
        face={{
          amount: 1,
          count: 1,
          disabled: false,
          intersects: 0,
          stance: 'attack',
          type: 'ranged'
        }}
      />
      <Dice
        tokens={0}
        keep={false}
        index="1"
        locked={false}
        face={{
          amount: 1,
          count: 1,
          disabled: false,
          intersects: 0,
          stance: 'attack',
          type: 'ranged'
        }}
      />
      <Dice
        tokens={0}
        keep={false}
        index="1"
        locked={false}
        face={{
          amount: 1,
          count: 1,
          disabled: false,
          intersects: 0,
          stance: 'attack',
          type: 'ranged'
        }}
      />
      <Dice
        tokens={0}
        keep={false}
        index="1"
        locked={false}
        face={{
          amount: 1,
          count: 1,
          disabled: false,
          intersects: 0,
          stance: 'attack',
          type: 'ranged'
        }}
      />
      <Dice
        tokens={0}
        keep={false}
        index="1"
        locked={false}
        face={{
          amount: 1,
          count: 1,
          disabled: false,
          intersects: 0,
          stance: 'attack',
          type: 'ranged'
        }}
      />
      <Dice
        tokens={0}
        keep={false}
        index="1"
        locked={false}
        face={{
          amount: 1,
          count: 1,
          disabled: false,
          intersects: 0,
          stance: 'attack',
          type: 'ranged'
        }}
      />
    </div>
  )
}
