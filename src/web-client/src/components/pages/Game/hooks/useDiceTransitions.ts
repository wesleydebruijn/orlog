import { useEffect, useState } from 'react'
import { interpolate, useTransition } from 'react-spring'
import { range } from 'lodash'

import { Dice, DiceFace, Phase, PhaseId, Player } from '../../../../types/types'
import { sort } from '../../../../utils/dice'

const DICE_WIDTH = 64
const DICE_MARGIN = 20
const DICE_SPACE = 15

type Face = {
  stance: DiceFace['stance']
  type: DiceFace['type']
}

function calculateWidth(dices: any, index: number, faceOff: boolean) {
  if (!faceOff) return DICE_WIDTH + DICE_MARGIN

  const dice = dices[index]
  const nextDice = dices[index + 1]

  if (
    !nextDice ||
    (dice.face.stance === nextDice.face.stance && dice.face.type === nextDice.face.type)
  ) {
    return DICE_WIDTH + DICE_MARGIN - DICE_SPACE
  } else {
    return DICE_WIDTH + DICE_MARGIN
  }
}

function faceOffDices(player: Player, opponent: Player, started: boolean) {
  const playerDices = Object.values(player.dices)
  const opponentDices = Object.values(opponent.dices)

  const newDices = Object.entries(opponentDices.reduce(requiredOpposingDices, {}))
    .reduce((acc: Dice[], [key, count]) => {
      const placeholderDices = createPlaceholderDices(playerDices, key, count)

      return [...acc, ...placeholderDices]
    }, playerDices)
    .map(addDiceIndex)

  return sort(newDices as Dice[], started)
}

function initialDices(player: Player) {
  return Object.values(player.dices).map(addDiceIndex)
}

function requiredOpposingDices(acc: { [key: string]: number }, dice: Dice) {
  const stance = dice.face.stance === 'block' ? 'attack' : 'block'
  const key = `${dice.face.type}-${stance}`

  return { ...acc, [key]: (acc[key] || 0) + 1 }
}

function addDiceIndex(dice: Dice, index: number) {
  return { ...dice, index: index + 1 }
}

function createPlaceholderDices(dices: Dice[], key: string, count: number) {
  const [type, stance] = key.split('-')
  const diceCount = dices.filter(dice => stance === dice.face.stance && type === dice.face.type)
    .length

  return range(Math.max(count - diceCount, 0)).map(i => createDice({ type, stance } as Face))
}

function createDice({ stance, type }: Face): Dice {
  return {
    tokens: 0,
    locked: true,
    keep: true,
    placeholder: true,
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

export function useDiceTransitions(
  player: Player,
  opponent: Player,
  phase: Phase,
  started: boolean
) {
  const [sortedDices, setSortedDices] = useState(initialDices(player))
  const faceOff = phase.id > PhaseId.Roll

  let width = 0
  const transitions = useTransition(
    sortedDices.map((dice, index) => {
      const diceWidth = calculateWidth(sortedDices, index, faceOff)

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

  const containerStyle = { width, position: 'relative' as 'relative' }
  const diceStyle = ({ x, ...rest }: any, index: number) => {
    return {
      zIndex: sortedDices.length - index,
      position: 'absolute',
      transform: interpolate([x], x => `translate3d(${x}px,0,0)`),
      ...rest
    }
  }

  useEffect(() => {
    if (faceOff) {
      setSortedDices(faceOffDices(player, opponent, started))
    } else {
      setSortedDices(initialDices(player))
    }
  }, [player.dices, faceOff])

  return {
    containerStyle,
    diceStyle,
    transitions
  }
}
