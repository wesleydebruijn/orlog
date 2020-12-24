import React from 'react'
import classNames from 'classnames'

import { GodFavorIcon } from '../../../../shared/Icons'

import './FavorCard.scss'

type Props = {
  index: number
  className?: string
  name: string
  description: string
  children?: React.ReactNode
  active?: boolean
  highlight?: boolean
  onClick?: (index: number) => void
}

type TierProps = {
  description: string
  value: number
  cost: number
  active: boolean
  onClick: () => void
}

export function FavorCard({
  className,
  name,
  description,
  onClick,
  index,
  active = false,
  highlight = false,
  children
}: Props) {
  const classes = classNames('favor-card', className, {
    'favor-card--clickable': onClick !== undefined,
    'favor-card--highlight': highlight
  })
  const tierClasses = classNames('favor-card__tiers', {
    'favor-card__tiers--active': active
  })

  return (
    <div className={classes}>
      <div className="favor-card__info" onClick={() => onClick && onClick(index)}>
        <h2>{name}</h2>
        <span>{description}</span>
      </div>
      {children && <div className={tierClasses}>{children}</div>}
    </div>
  )
}

export function Tier({ description, value, cost, active, onClick }: TierProps) {
  const classes = classNames('favor-tier__activate', {
    'favor-tier__activate--active': active
  })

  return (
    <div className="favor-tier">
      <span className="favor-tier__description">{description.replace(/{value}/, `${value}`)}</span>
      <span className="favor-tier__cost">
        <GodFavorIcon />
        {cost}
      </span>
      <button onClick={() => onClick()} className={classes}>
        Activate
      </button>
    </div>
  )
}
