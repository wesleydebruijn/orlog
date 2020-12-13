import { useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import classnames from 'classnames'

import { Dice as DiceProps, PhaseId } from '../../../../../types/types'
import { useBoolean } from '../../../../../hooks/useBoolean'
import { usePlayer } from '../../../../../hooks/usePlayer'

import './Dice.scss'

import meleeAttack from './assets/melee-attack.svg'
import meleeBlock from './assets/melee-block.svg'
import rangedAttack from './assets/ranged-attack.svg'
import rangedBlock from './assets/ranged-block.svg'
import tokenSteal from './assets/token-steal.svg'
import { useGame } from '../../../../../hooks/useGame'

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
  const { phase } = useGame()
  const { self } = usePlayer()
  const [rolling, setRolling] = useBoolean(500)
  const [collecting, setCollecting] = useBoolean(1000)

  const margin = locked ? 0 : keep ? 25 : 50
  const keepAnimation = {
    marginTop: self ? margin : -margin,
    config: { mass: 1, tension: 880, friction: 30 }
  }

  const diceProps = useSpring(keepAnimation)
  const diceClasses = classnames('dice', {
    'dice--toggleable': onClick !== undefined && !locked,
    'dice--placeholder': placeholder,
    'dice--rolling': rolling && !keep && !locked
  })

  const faceProps = useSpring({
    boxShadow: collecting && tokens > 0 ? '0px 0px 10px #f39c12' : '0px 0px 0px #fff',
    config: { mass: 3, tension: 400, friction: 150 }
  })
  const faceClasses = classnames('face', {
    'face--tokens': tokens > 0
  })

  useEffect(() => setRolling(rolled), [rolled])
  useEffect(() => setCollecting(phase.id === PhaseId.Resolution), [phase.id])

  return (
    <animated.div
      style={diceProps}
      className={diceClasses}
      onClick={() => onClick && onClick(index)}
    >
      <div className="front">
        <animated.img
          style={faceProps}
          src={FACES[`${face.type}-${face.stance}`]}
          className={faceClasses}
          alt=""
        />
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
