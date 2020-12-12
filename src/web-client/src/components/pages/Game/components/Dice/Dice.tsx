import { useEffect } from 'react'
import classnames from 'classnames'
import { animated, useSpring } from 'react-spring'

import { Dice as DiceProps } from '../../../../../types/types'
import { useAnimation } from '../../../../../hooks/useAnimation'

import './dice.scss'

import meleeAttack from './assets/melee-attack.svg'
import meleeBlock from './assets/melee-block.svg'
import rangedAttack from './assets/ranged-attack.svg'
import rangedBlock from './assets/ranged-block.svg'
import tokenSteal from './assets/token-steal.svg'
import { usePlayer } from '../../../../../hooks/usePlayer'

const faces: { [index: string]: any } = {
  'melee-attack': meleeAttack,
  'melee-block': meleeBlock,
  'ranged-attack': rangedAttack,
  'ranged-block': rangedBlock,
  'token-steal': tokenSteal
}

type Props = DiceProps & {
  index: number
  onClick?: (index: number) => void
  rolled: boolean
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
  const diceProps = useSpring({ marginTop: keep ? 0 : self ? 50 : -50 })

  const { active: isRolling, setActive: rollAnimation } = useAnimation(500)

  const classes = classnames('dice', {
    'dice--toggleable': onClick !== undefined && !locked,
    'dice--locked': locked,
    'dice--placeholder': placeholder,
    roll: isRolling
  })

  useEffect(() => {
    if (rolled && !keep && !locked) {
      rollAnimation(true)
    }
  }, [rolled])

  function faceClasses(hasTokens: boolean) {
    return classnames({
      tokens: hasTokens
    })
  }

  const randomFace = () => Object.keys(faces)[Math.floor(Math.random() * Object.keys(faces).length)]
  const randomTokens = () => Math.round(Math.random())

  return (
    <animated.div style={diceProps} className={classes} onClick={() => onClick && onClick(index)}>
      <div className="front active">
        <img
          src={faces[`${face.type}-${face.stance}`]}
          className={faceClasses(tokens > 0)}
          alt=""
        />
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
    </animated.div>
  )
}
