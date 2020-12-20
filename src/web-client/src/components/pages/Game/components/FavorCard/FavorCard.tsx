import React from 'react'
import classNames from 'classnames'

import { GodFavorIcon } from '../../../../shared/Icons'

import './FavorCard.scss'

type Props = {
  index: number
  className?: string
  name: string
  description: string
  children: React.ReactNode
  active?: boolean
  open: (index: number) => void
}

export function FavorCard({
  className,
  name,
  description,
  open,
  index,
  active = false,
  children
}: Props) {
  const classes = classNames('favor-card', className)

  return (
    <div className={classes}>
      <div className="favor-card__info" onClick={() => open(index)}>
        <h2>{name}</h2>
        <span>{description}</span>
      </div>
      {active && <div className="favor-card__tiers">{children}</div>}
    </div>
  )
}

export function Tier({
  description,
  value,
  cost,
  onClick
}: {
  description: string
  value: number
  cost: number
  onClick: () => void
}) {
  return (
    <div className="favor-tier">
      <span className="favor-tier__description">{description.replace(/{value}/, `${value}`)}</span>
      <span className="favor-tier__cost">
        <GodFavorIcon />
        {cost}
      </span>
      <button onClick={() => onClick} className="favor-tier__activate">
        Activate
      </button>
    </div>
  )
}
