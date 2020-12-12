import { useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import classnames from 'classnames'

import { Dice as DiceProps } from '../../../../../types/types'
import { useBoolean } from '../../../../../hooks/useBoolean'
import { usePlayer } from '../../../../../hooks/usePlayer'

import './Dice.scss'

import meleeAttack from './assets/melee-attack.svg'
import meleeBlock from './assets/melee-block.svg'
import rangedAttack from './assets/ranged-attack.svg'
import rangedBlock from './assets/ranged-block.svg'
import tokenSteal from './assets/token-steal.svg'

const FACES: { [index: string]: any } = {
  'melee-attack': meleeAttack,
  'melee-block': meleeBlock,
  'ranged-attack': rangedAttack,
  'ranged-block': rangedBlock,
  'token-steal': tokenSteal
}

const randomFace = () => Object.keys(FACES)[Math.floor(Math.random() * Object.keys(FACES).length)]
const randomFaceClasses = () =>
  classnames('face', { 'face--tokens': Math.round(Math.random()) > 0 })

type Props = DiceProps & {
  index: number
  rolled: boolean
  onClick?: (index: number) => void
}

export default function Dice({
  index,
  face,
  tokens,
  keep,
  locked,
  rolled,
  placeholder,
  onClick
}: Props) {
  const { self } = usePlayer()
  const [rolling, setRolling] = useBoolean(500)

  const margin = locked ? 0 : keep ? 25 : 50
  const diceProps = useSpring({
    marginTop: self ? margin : -margin,
    config: { mass: 1, tension: 380, friction: 30 }
  })
  const diceClasses = classnames('dice', {
    'dice--toggleable': onClick !== undefined && !locked,
    'dice--placeholder': placeholder,
    'dice--rolling': rolling && !keep && !locked
  })
  const faceClasses = classnames('face', {
    'face--tokens': tokens > 0
  })

  useEffect(() => setRolling(rolled), [rolled])

  return (
    <animated.div
      style={diceProps}
      className={diceClasses}
      onClick={() => onClick && onClick(index)}
    >
      <div className="front">
        <img src={FACES[`${face.type}-${face.stance}`]} className={faceClasses} alt="" />
      </div>
      <div className="back">
        <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
      </div>
      <div className="right">
        <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
      </div>
      <div className="left">
        <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
      </div>
      <div className="top">
        <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
      </div>
      <div className="bottom">
        <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
      </div>
    </animated.div>
  )
}
