import React, { useEffect, useState } from 'react'
import { useTransition, animated, interpolate } from 'react-spring'
import { isEqual, range } from 'lodash'

import { Dice as DiceProps, DiceFace } from '../../../../../../types/types'
import { usePlayer } from '../../../../../../hooks/usePlayer'
import { useGame } from '../../../../../../hooks/useGame'
import Dice from '../Dice'

import './DiceGrid.scss'

type Props = {
  dices: {
    [index: number]: DiceProps
  }
  rolled: boolean
  onToggleDice?: (index: string) => void
}

const stances = {
  attack: 1,
  block: 2,
  steal: 3
}

function sortByOffense(a: DiceProps, b: DiceProps) {
  return stances[a.face.stance] - stances[b.face.stance]
}

function sortByDefence(a: DiceProps, b: DiceProps) {
  return stances[b.face.stance] - stances[a.face.stance]
}

function sortByType(a: DiceProps, b: DiceProps) {
  if (a.face.type < b.face.type) return -1
  if (a.face.type > b.face.type) return 1

  return 0
}

function sort(collection: any, started: boolean) {
  if (started) {
    return [...collection.sort(sortByType).sort(sortByOffense)]
  } else {
    return [...collection.sort(sortByType).sort(sortByDefence)]
  }
}

type Face = {
  stance: DiceFace['stance']
  type: DiceFace['type']
}

function createDice({ stance, type }: Face): DiceProps {
  return {
    tokens: 0,
    locked: true,
    keep: true,
    face: {
      stance,
      type,
      count: 0,
      amount: 0,
      intersects: 0,
      disabled: true
    }
  }
}

export default function DiceGrid({ dices, rolled, onToggleDice }: Props) {
  const { started, player, opponent } = usePlayer()
  const { phase } = useGame()

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

  function getOpposite(stance: string) {
    if (stance === 'attack') return 'block'
    if (stance === 'block') return 'attack'

    return 'xxx'
  }

  useEffect(() => {
    if (phase.id > 1) {
      const requiredDices = Object.values(opponent.dices).reduce(
        (acc: { [key: string]: number }, dice) => {
          const stance = getOpposite(dice.face.stance)
          const key = `${dice.face.type}-${stance}`

          return { ...acc, [key]: (acc[key] || 0) + 1 }
        },
        {}
      )

      const newDices = Object.entries(requiredDices)
        .reduce((acc: DiceProps[], [key, count]) => {
          const [type, stance] = key.split('-')
          const playerDicesCount = Object.values(player.dices).filter(
            dice => stance === dice.face.stance && type === dice.face.type
          ).length

          return [
            ...acc,
            ...range(Math.max(count - playerDicesCount, 0)).map(i =>
              createDice({ type, stance } as Face)
            )
          ]
        }, extendedDices)
        .map((dice, index) => ({ ...dice, index: index + 1 }))

      console.log(requiredDices)
      console.log(newDices)
      // const faces: Face[] = [
      //   { stance: 'attack', type: 'melee' },
      //   { stance: 'block', type: 'melee' },
      //   { stance: 'attack', type: 'ranged' },
      //   { stance: 'block', type: 'ranged' },
      //   { stance: 'steal', type: 'token' },
      // ]

      // const newDices = faces
      //   .reduce((acc: DiceProps[], face) => {
      // const playerDicesCount = Object.values(player.dices).filter(
      //   dice => face.stance === dice.face.stance && face.type === dice.face.type
      // ).length
      //     const opponentDicesCount = Object.values(opponent.dices).filter(
      //       dice => face.stance === dice.face.stance && face.type === dice.face.type
      //     ).length

      //     const newDicesCount: number =
      //       Math.max(playerDicesCount, opponentDicesCo  unt) - playerDicesCount

      //     return [...acc, ...range(newDicesCount).map(i => createDice(face))]
      //   }, extendedDices)
      //   .map((dice, index) => ({ ...dice, index: index + 1 }))

      setAnimatedDices(sort(newDices, started))
    } else {
      setAnimatedDices(extendedDices)
    }
  }, [dices, phase.id])

  return (
    <>
      <button onClick={() => setAnimatedDices(sort(animateDices, started))}>Test</button>
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
