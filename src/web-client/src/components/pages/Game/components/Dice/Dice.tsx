// import { Dice as DiceProps } from '../../../../../types/types'

import './Dice.scss'

// import meleeAttack from './assets/melee-attack.svg'
// import meleeBlock from './assets/melee-block.svg'
// import rangedAttack from './assets/ranged-attack.svg'
// import rangedBlock from './assets/ranged-block.svg'
// import tokenSteal from './assets/token-steal.svg'
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

// const FACES: { [index: string]: any } = {
//   'melee-attack': meleeAttack,
//   'melee-block': meleeBlock,
//   'ranged-attack': rangedAttack,
//   'ranged-block': rangedBlock,
//   'token-steal': tokenSteal
// }

// const randomFace = () => Object.keys(FACES)[Math.floor(Math.random() * Object.keys(FACES).length)]
// const randomFaceClasses = () =>
//   classnames('face', { 'face--tokens': Math.round(Math.random()) > 0 })

// export default function Dice({
//   index,
//   face,
//   tokens,
//   keep,
//   locked,
//   rolled,
//   placeholder,
//   onClick
// }: Props) {
//   const classes = classnames('dice', {
//     'dice--toggleable': onClick !== undefined && !locked,
//     'dice--placeholder': placeholder
//   })

//   return (
//     <div className={classes} onClick={() => onClick && onClick(index)}>
//       <div className="front">
//         <img src={FACES[`${face.type}-${face.stance}`]} className="face" alt="" />
//       </div>
//       <div className="back">
//         <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
//       </div>
//       <div className="right">
//         <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
//       </div>
//       <div className="left">
//         <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
//       </div>
//       <div className="top">
//         <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
//       </div>
//       <div className="bottom">
//         <img src={FACES[randomFace()]} className={randomFaceClasses()} alt="" />
//       </div>
//     </div>
//   )
// }

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
