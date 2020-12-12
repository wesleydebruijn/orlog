import { range } from 'lodash'
import { Dice, DiceFace, Player } from '../../../../../../types/types'

type Face = {
  stance: DiceFace['stance']
  type: DiceFace['type']
}

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

export function faceOffDices(player: Player, opponent: Player, started: boolean) {
  const playerDices = Object.values(player.dices)
  const opponentDices = Object.values(opponent.dices)

  const newDices = Object.entries(opponentDices.reduce(requiredOpposingDices, {}))
    .reduce((acc: Dice[], [key, count]) => {
      const placeholderDices = createPlaceholderDices(playerDices, key, count)

      return [...acc, ...placeholderDices]
    }, playerDices)
    .map(addDiceIndex)

  return sort(newDices, started)
}

export function initialDices(player: Player) {
  return Object.values(player.dices).map(addDiceIndex)
}

function sortByOffense(a: Dice, b: Dice) {
  return OFFENSE[`${a.face.type}-${a.face.stance}`] - OFFENSE[`${b.face.type}-${b.face.stance}`]
}

function sortByDefence(a: Dice, b: Dice) {
  return DEFENSE[`${a.face.type}-${a.face.stance}`] - DEFENSE[`${b.face.type}-${b.face.stance}`]
}

function sort(dices: any, started: boolean) {
  if (started) {
    return [...dices.sort(sortByOffense)]
  } else {
    return [...dices.sort(sortByDefence)]
  }
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
