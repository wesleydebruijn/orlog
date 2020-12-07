import { useEffect, useState } from 'react'
import classnames from 'classnames'
import { Dice as DiceProps, DiceFace } from '../../../../../types/types'

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

export default function Dice({ index, face, tokens, keep, locked, onClick }: Props) {
  const [noAnimate, setNoAnimate] = useState(true)
  const classes = classnames('dice', `${face.type}-${face.stance}`, {
    'dice--tokens': tokens > 0,
    'dice--toggleable': onClick !== undefined && !locked,
    'dice--kept': keep,
    'dice--locked': locked,
    'dice--no-animate': noAnimate
  })

  useEffect(() => {
    setTimeout(() => setNoAnimate(false), 1000)
  }, [])

  return (
    <div className={classes} onClick={() => onClick && onClick(index)}>
      <div className="front">
        <img src={faces['ranged-attack']} alt="" />
      </div>
      <div className="back">
        <img src={faces['melee-attack']} alt="" />
      </div>
      <div className="right">
        <img src={faces['melee-block']} alt="" />
      </div>
      <div className="left">
        <img src={faces['ranged-block']} alt="" />
      </div>
      <div className="top">
        <img src={faces['token-steal']} alt="" />
      </div>
      <div className="bottom">
        <img src={faces['ranged-block']} alt="" />
      </div>
    </div>
  )
}
