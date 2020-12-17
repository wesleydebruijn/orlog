import classNames from 'classnames'
import React from 'react'

import type { FaceType } from '../../../../types/types'

import {
  MeleeAttackIcon,
  MeleeBlockIcon,
  RangedAttackIcon,
  RangedBlockIcon,
  TokenStealIcon
} from '../../../shared/Icons'

export function Dice({
  value = randomFace(),
  hasTokens,
  onClick,
  locked,
  hidden,
  selected,
  rolling
}: {
  value?: FaceType
  hasTokens: boolean
  onClick?: () => void
  locked: boolean
  hidden: boolean
  selected: boolean
  rolling: boolean
}) {
  const faceClasses = 'text-white flex items-center justify-center'
  const classes = classNames('dice m-4 w-16 h-16', {
    'hover:shadow-dice-hover cursor-pointer': onClick !== undefined && !locked,
    invisible: hidden,
    'mt-2': selected,
    'dice--rolling': rolling && !locked
  })

  const tokenClass = 'border-2 border-orange'
  const hasToken = () => (Math.round(Math.random()) ? '' : tokenClass)

  return (
    <div onClick={onClick} className={classes}>
      <div className={classNames('dice__front', faceClasses, hasTokens && tokenClass)}>
        <Face face={value} />
      </div>
      <div className={classNames('dice__back', faceClasses, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__right', faceClasses, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__left', faceClasses, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__top', faceClasses, hasToken())}>
        <Face face={randomFace()} />
      </div>
      <div className={classNames('dice__bottom', faceClasses, hasToken())}>
        <Face face={randomFace()} />
      </div>
    </div>
  )
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
