import { Dice, FaceType } from '../types/types'

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

export function getFaceType(dice: Dice): FaceType {
  return `${dice.face.type}-${dice.face.stance}` as FaceType
}

export function sortByOffense(a: Dice, b: Dice) {
  return OFFENSE[getFaceType(a)] - OFFENSE[getFaceType(b)]
}

export function sortByDefence(a: Dice, b: Dice) {
  return DEFENSE[getFaceType(a)] - DEFENSE[getFaceType(b)]
}

export function sort(dices: any[], started: boolean) {
  return dices.sort(started ? sortByOffense : sortByDefence)
}
