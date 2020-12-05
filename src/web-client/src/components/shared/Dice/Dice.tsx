import classnames from 'classnames'
import { Dice as DiceProps, DiceFace } from '../../../types/types'

import './dice.scss'

import meleeAttack from './assets/melee-attack.svg'
import meleeBlock from './assets/melee-block.svg'
import rangedAttack from './assets/ranged-attack.svg'
import rangedBlock from './assets/ranged-block.svg'
import tokenSteal from './assets/token-steal.svg'

const faces = {
  'melee-attack': meleeAttack,
  'melee-block': meleeBlock,
  'ranged-attack': rangedAttack,
  'ranged-block': rangedBlock,
  'token-steal': tokenSteal
}

type Props = DiceProps & {
  index: string
  onClick?: (index: string) => void
}

export default function Dice({
  index,
  face,
  tokens,
  keep,
  locked,
  onClick = (index: string) => {}
}: Props) {
  const classes = classnames('dice', {
    ['dice--tokens']: tokens > 0,
    ['dice--kept']: keep,
    ['dice--locked']: locked
  })

  function determineFace(face: DiceFace) {
    // @ts-ignore
    return faces[`${face.type}-${face.stance}`]
  }

  return <img className={classes} src={determineFace(face)} onClick={() => onClick(index)} />
}
