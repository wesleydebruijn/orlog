import { range } from 'lodash'
import { Dice, DiceType, FaceStance, FaceType } from '../types/types'

const DICE_TYPE_SPLITTER = '-'
const DICE_TYPES: DiceType[] = [
  'token-steal',
  'ranged-attack',
  'ranged-block',
  'melee-attack',
  'melee-block'
]

const OFFENSE: { [index: string]: number } = {
  'melee-attack': 1,
  'ranged-attack': 2,
  'melee-block': 3,
  'ranged-block': 4,
  'token-steal': 5,
  'token-block': 6
}

const DEFENSE: { [index: string]: number } = {
  'melee-block': 1,
  'ranged-block': 2,
  'melee-attack': 3,
  'ranged-attack': 4,
  'token-block': 5,
  'token-steal': 6
}

type DiceTypeCount = {
  [type: string]: number
}

export function randomDiceType(): DiceType {
  return DICE_TYPES[Math.floor(Math.random() * DICE_TYPES.length)]
}

export function getDiceType(dice: Dice): DiceType {
  return [dice.face.type, dice.face.stance].join(DICE_TYPE_SPLITTER) as DiceType
}

export function getOpposingDiceType(dice: Dice): DiceType {
  const oppositeStance = dice.face.stance === 'block' ? 'attack' : 'block'

  return [dice.face.type, oppositeStance].join(DICE_TYPE_SPLITTER) as DiceType
}

export function addDiceIndex(dice: any, index: number) {
  return { ...dice, index: index + 1 }
}

export function sortByOffense(a: Dice, b: Dice) {
  return OFFENSE[getDiceType(a)] - OFFENSE[getDiceType(b)]
}

export function sortByDefence(a: Dice, b: Dice) {
  return DEFENSE[getDiceType(a)] - DEFENSE[getDiceType(b)]
}

export function createDice(diceType: DiceType, props: any = {}): Dice {
  const [type, stance] = diceType.split(DICE_TYPE_SPLITTER)
  return {
    tokens: 0,
    locked: false,
    keep: false,
    placeholder: false,
    face: {
      stance: stance as FaceStance,
      type: type as FaceType,
      count: 0,
      amount: 0,
      intersects: 0,
      disabled: false
    },
    ...props
  }
}

export function faceOffDices(dices: Dice[], otherDices: Dice[]) {
  return addRequiredDices(dices, requiredDiceTypes(otherDices))
}

export function requiredDiceTypes(dices: Dice[]): DiceTypeCount {
  return dices.reduce((acc: DiceTypeCount, dice: Dice) => {
    const diceType = getOpposingDiceType(dice)

    return { ...acc, [diceType]: (acc[diceType] || 0) + 1 }
  }, {})
}

export function addRequiredDices(dices: Dice[], requiredDiceTypes: DiceTypeCount): Dice[] {
  return Object.entries(requiredDiceTypes).reduce((acc: Dice[], [key, count]) => {
    const diceType = key as DiceType
    const amount = count - dices.filter(dice => getDiceType(dice) === diceType).length

    return [
      ...acc,
      ...range(Math.max(amount, 0)).map(_i =>
        createDice(diceType, { locked: true, keep: true, placeholder: true })
      )
    ]
  }, dices)
}
