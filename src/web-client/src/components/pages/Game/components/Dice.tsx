import classNames from 'classnames'
import React from 'react'
import { animated, useSpring } from 'react-spring'

import type { FaceType } from '../../../../types/types'

import {
  MeleeAttackIcon,
  MeleeBlockIcon,
  RangedAttackIcon,
  RangedBlockIcon,
  TokenStealIcon
} from '../../../shared/Icons'

type Props = {
  value?: FaceType
  hasTokens: boolean
  onClick?: () => void
  locked: boolean
  hidden: boolean
  selected: boolean
  rolling: boolean
  tag?: string
  style?: object
}

export function Dice({
  value = randomFace(),
  hasTokens,
  onClick,
  locked,
  hidden,
  selected,
  rolling,
  style = {}
}: Props) {
  const tokenClasses = 'border-2 border-dashed p-1 border-orange'
  const classes = classNames('dice m-4 w-16 h-16', {
    'hover:shadow-dice-hover cursor-pointer': onClick !== undefined && !locked,
    invisible: hidden,
    'mt-2': selected,
    'dice--rolling': rolling && !locked
  })

  return (
    <animated.div style={style} onClick={onClick} className={classes}>
      <div className={'dice__front'}>
        <Face face={value} className={classNames({ [`${tokenClasses}`]: hasTokens })} />
      </div>
      <div className={'dice__back'}>
        <Face
          face={randomFace()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__right'}>
        <Face
          face={randomFace()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__left'}>
        <Face
          face={randomFace()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__top'}>
        <Face
          face={randomFace()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__bottom'}>
        <Face
          face={randomFace()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
    </animated.div>
  )
}

export function AnimatedDice(props: Props & { self: boolean }) {
  const { locked, selected, self } = props

  const margin = locked ? 0 : selected ? 25 : 50
  const keepAnimation = {
    marginTop: self ? margin : -margin,
    config: { mass: 1, tension: 880, friction: 30 }
  }

  const style = useSpring(keepAnimation)

  return <Dice {...props} style={style} />
}

const randomFace: () => FaceType = () => {
  const faces: FaceType[] = [
    'token-steal',
    'ranged-attack',
    'ranged-block',
    'melee-attack',
    'melee-block'
  ]
  return faces[Math.floor(Math.random() * faces.length)]
}

export function Face({ face, className }: { face: FaceType; className?: string }) {
  const classes = classNames('flex text-white items-center justify-center', className)
  let faceIcon

  switch (face) {
    case 'melee-attack':
      faceIcon = <MeleeAttackIcon className="w-8" />
      break
    case 'melee-block':
      faceIcon = <MeleeBlockIcon className="w-8" />
      break
    case 'ranged-attack':
      faceIcon = <RangedAttackIcon className="w-8" />
      break
    case 'ranged-block':
      faceIcon = <RangedBlockIcon className="w-8" />
      break
    case 'token-steal':
      faceIcon = <TokenStealIcon className="w-8" />
      break
  }

  return <div className={classes}>{faceIcon}</div>
}
