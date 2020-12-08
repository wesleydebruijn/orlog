import classnames from 'classnames'
import { Dice as DiceProps, DiceFace } from '../../../../../types/types'

import './dice.scss'

import meleeAttack from './assets/melee-attack.svg'
import meleeBlock from './assets/melee-block.svg'
import rangedAttack from './assets/ranged-attack.svg'
import rangedBlock from './assets/ranged-block.svg'
import tokenSteal from './assets/token-steal.svg'

const faces: { [index: string]: any } = {
  'melee-attack': meleeAttack,
  'melee-block': meleeBlock,
  'ranged-attack': rangedAttack,
  'ranged-block': rangedBlock,
  'token-steal': tokenSteal
}

type Props = DiceProps & {
  index: string
  onClick?: (index: string) => void
  rolling: boolean
}

export default function Dice({ index, face, tokens, keep, locked, rolling, onClick }: Props) {
  const activeFace = `${face.type}-${face.stance}`

  const classes = classnames('dice', activeFace, {
    'dice--toggleable': onClick !== undefined && !locked,
    'dice--kept': keep,
    'dice--locked': locked,
    roll: rolling && !keep && !locked
  })

  function faceClasses(hasTokens: boolean) {
    return classnames({
      tokens: hasTokens
    })
  }

  const randomFace = () => Object.keys(faces)[Math.floor(Math.random() * Object.keys(faces).length)]
  const randomTokens = () => Math.round(Math.random())

  return (
    <div className={classes} onClick={() => onClick && onClick(index)}>
      <div className="front active">
        <img src={faces[activeFace]} className={faceClasses(tokens > 0)} alt="" />
      </div>
      <div className="back">
        <img src={faces[randomFace()]} className={faceClasses(randomTokens() > 0)} alt="" />
      </div>
      <div className="right">
        <img src={faces[randomFace()]} className={faceClasses(randomTokens() > 0)} alt="" />
      </div>
      <div className="left">
        <img src={faces[randomFace()]} className={faceClasses(randomTokens() > 0)} alt="" />
      </div>
      <div className="top">
        <img src={faces[randomFace()]} className={faceClasses(randomTokens() > 0)} alt="" />
      </div>
      <div className="bottom">
        <img src={faces[randomFace()]} className={faceClasses(randomTokens() > 0)} alt="" />
      </div>
    </div>
  )
}
