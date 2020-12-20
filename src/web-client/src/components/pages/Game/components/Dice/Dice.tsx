import { useEffect } from 'react'
import classNames from 'classnames'
import { animated, useSpring } from 'react-spring'

import { useBoolean } from '../../../../../hooks/useBoolean'
import { randomDiceType } from '../../../../../utils/dice'
import { DiceType } from '../../../../../types/types'
import {
  MeleeAttackIcon,
  MeleeBlockIcon,
  RangedAttackIcon,
  RangedBlockIcon,
  TokenStealIcon
} from '../../../../shared/Icons'

import './Dice.scss'

type Props = {
  value?: DiceType
  hasTokens: boolean
  onClick?: () => void
  locked: boolean
  hidden: boolean
  selected: boolean
  className?: string
  style?: object
}

export function Dice({
  value = randomDiceType(),
  hasTokens,
  onClick,
  locked,
  hidden,
  className,
  style = {}
}: Props) {
  const classes = classNames('dice', className, {
    'dice--toggleable': onClick !== undefined && !locked,
    'dice--hidden': hidden
  })

  return (
    <div onClick={onClick} className={classes} style={style}>
      <div className={'dice__front'}>
        <Face type={value} className={classNames({ 'face--tokens': hasTokens })} />
      </div>
      <div className={'dice__back'}>
        <Face
          type={randomDiceType()}
          className={classNames({ 'face--tokens': Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__right'}>
        <Face
          type={randomDiceType()}
          className={classNames({ 'face--tokens': Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__left'}>
        <Face
          type={randomDiceType()}
          className={classNames({ 'face--tokens': Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__top'}>
        <Face
          type={randomDiceType()}
          className={classNames({ 'face--tokens': Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__bottom'}>
        <Face
          type={randomDiceType()}
          className={classNames({ 'face--tokens': Math.round(Math.random()) })}
        />
      </div>
    </div>
  )
}

export function AnimatedDice(props: Props & { self: boolean; rolled: boolean }) {
  const { locked, selected, self, rolled, style, className } = props

  // roll animation
  const [rolling, setRolling] = useBoolean(500)
  const diceClasses = classNames(className, { 'dice--rolling': rolling && !locked })

  useEffect(() => setRolling(rolled), [rolled])

  // select animation
  const margin = locked ? 0 : selected ? 25 : 50
  const selectAnimation = {
    marginTop: self ? margin : -margin,
    config: { mass: 1, tension: 880, friction: 30 }
  }

  const selectStyle = useSpring(selectAnimation)

  return (
    <animated.div style={{ ...style, ...selectStyle }}>
      <Dice {...props} className={diceClasses} />
    </animated.div>
  )
}

export function Face({ type, className }: { type: DiceType; className?: string }) {
  const classes = classNames('face', className)
  let faceIcon

  switch (type) {
    case 'melee-attack':
      faceIcon = <MeleeAttackIcon />
      break
    case 'melee-block':
      faceIcon = <MeleeBlockIcon />
      break
    case 'ranged-attack':
      faceIcon = <RangedAttackIcon />
      break
    case 'ranged-block':
      faceIcon = <RangedBlockIcon />
      break
    case 'token-steal':
      faceIcon = <TokenStealIcon />
      break
  }

  return <div className={classes}>{faceIcon}</div>
}
