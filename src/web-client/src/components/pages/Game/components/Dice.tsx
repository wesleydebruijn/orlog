import React from 'react'
import classNames from 'classnames'

import { FaceType } from '../../../../types/types'

import {
  MeleeAttackIcon,
  MeleeBlockIcon,
  RangedAttackIcon,
  RangedBlockIcon,
  TokenStealIcon
} from '../../../shared/Icons'

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

function Face({ face, className }: { face: FaceType; className?: string }) {
  const classes = classNames('flex items-center justify-center', className)
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

export function Dices({ className }: { className?: string }) {
  const classes = classNames(
    'flex flex-initial w-2/3 justify-center items-center self-center',
    className
  )

  return (
    <div className={classes}>
      <Dice value={randomFace()} />
      <Dice value={randomFace()} />
      <Dice value={randomFace()} />
      <Dice value={randomFace()} />
      <Dice value={randomFace()} />
      <Dice value={randomFace()} />
      <Dice value={randomFace()} />
    </div>
  )
}

export function Dice({ value }: { value: FaceType }) {
  const classes = 'text-white flex items-center justify-center'
  const hasToken = () => (Math.round(Math.random()) ? '' : 'border-2 border-orange')

  return (
    <div className="dice m-4 w-16 h-16">
      <div className={classNames('dice__front', classes, hasToken())}>
        <Face face={value} />
      </div>
      <div className={classNames('dice__back', classes, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__right', classes, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__left', classes, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__top', classes, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__bottom', classes, hasToken())}>
        <Face face={randomFace()} />
      </div>
    </div>
  )
}
