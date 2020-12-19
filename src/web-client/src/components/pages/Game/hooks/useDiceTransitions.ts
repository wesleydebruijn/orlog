import { interpolate, useTransition } from 'react-spring'

const DICE_WIDTH = 64
const DICE_MARGIN = 20
const DICE_SPACE = 15

function calculateWidth(dices: any, index: number, group: boolean) {
  if (!group) return DICE_WIDTH + DICE_MARGIN

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

export function useDiceTransitions(dices: any[], group: boolean) {
  let width = 0
  const transitions = useTransition(
    dices.map((dice, index) => {
      const diceWidth = calculateWidth(dices, index, group)

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
      position: 'absolute',
      zIndex: dices.length - index,
      transform: interpolate([x], x => `translate3d(${x}px,0,0)`),
      ...rest
    }
  }

  return {
    transitions,
    containerStyle,
    diceStyle
  }
}
