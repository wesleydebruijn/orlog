import React, { useEffect, useState } from 'react'
import { useTransition, animated, interpolate } from 'react-spring'
import shuffle from 'lodash/shuffle'

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
  const extendedDices = Object.entries(dices).map(([index, dice]) => ({ ...dice, index }))
  const [animateDices, setAnimatedDices] = useState(extendedDices)

  const diceWidth = 85

  let width = 0
  const transitions = useTransition(
    animateDices.map(dice => ({ ...dice, x: (width += diceWidth) - diceWidth })),
    dice => dice.index,
    {
      from: { width: 0, opacity: 0 },
      leave: { width: 0, opacity: 0 },
      enter: ({ x }) => ({ x, width: diceWidth, opacity: 1 }),
      update: ({ x }) => ({ x, width: diceWidth })
    }
  )

  function sortByOffense(a: DiceProps, b: DiceProps) {
    if (a.face.stance < b.face.stance) return -1
    if (a.face.stance > b.face.stance) return 1

    return 0
  }

  function sortByDefence(a: DiceProps, b: DiceProps) {
    if (a.face.stance === 'steal') return 0
    if (a.face.stance > b.face.stance) return -1
    if (a.face.stance < b.face.stance) return 1

    return 0
  }

  function sortByType(a: DiceProps, b: DiceProps) {
    if (a.face.type < b.face.type) return -1
    if (a.face.type > b.face.type) return 1

    return 0
  }

  function sort(collection: any) {
    console.log(collection)
    console.log(collection.sort(sortByType).sort(sortByOffense))

    return [...collection.sort(sortByType).sort(sortByOffense)]
  }

  useEffect(() => {
    setAnimatedDices(extendedDices)
  }, [dices])

  return (
    <>
      <button onClick={() => setAnimatedDices(sort)}>Test</button>
      <div className="dice-grid">
        <div className="dice-grid__container" style={{ width }}>
          {
            // @ts-ignore
            transitions.map(({ item, props: { x, ...rest }, key }, index) => (
              <animated.div
                key={key}
                style={{
                  zIndex: animateDices.length - index,
                  transform: interpolate([x], x => `translate3d(${x}px,0,0)`),
                  ...rest
                }}
              >
                <Dice key={item.index} {...item} rolled={rolled} onClick={onToggleDice} />
              </animated.div>
            ))
          }
        </div>
      </div>
    </>
  )
}
