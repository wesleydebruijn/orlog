import './Dice.scss'

import classNames from 'classnames'
import { randomDiceType } from '../../../../../utils/dice'
import { DiceType } from '../../../../../types/types'
import {
  MeleeAttackIcon,
  MeleeBlockIcon,
  RangedAttackIcon,
  RangedBlockIcon,
  TokenStealIcon
} from '../../../../shared/Icons'

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
  selected,
  className,
  style = {}
}: Props) {
  const tokenClasses = 'border-2 border-dashed p-1 border-orange'
  const classes = classNames('dice w-16 h-16', className, {
    'hover:shadow-dice-hover cursor-pointer': onClick !== undefined && !locked,
    invisible: hidden,
    'mt-2': selected
  })

  return (
    <div style={style} onClick={onClick} className={classes}>
      <div className={'dice__front'}>
        <Face type={value} className={classNames({ [`${tokenClasses}`]: hasTokens })} />
      </div>
      <div className={'dice__back'}>
        <Face
          type={randomDiceType()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__right'}>
        <Face
          type={randomDiceType()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__left'}>
        <Face
          type={randomDiceType()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__top'}>
        <Face
          type={randomDiceType()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
      <div className={'dice__bottom'}>
        <Face
          type={randomDiceType()}
          className={classNames({ [`${tokenClasses}`]: Math.round(Math.random()) })}
        />
      </div>
    </div>
  )
}

export function Face({ type, className }: { type: DiceType; className?: string }) {
  const classes = classNames('face flex text-white items-center justify-center', className)
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
