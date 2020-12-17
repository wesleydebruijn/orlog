import { Dice, FaceType } from '../types/types'

export function getFaceType(dice: Dice): FaceType {
  return `${dice.face.type}-${dice.face.stance}` as FaceType
}
