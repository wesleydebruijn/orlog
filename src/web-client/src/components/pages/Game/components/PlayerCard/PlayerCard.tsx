import classNames from 'classnames'
import React from 'react'

import { HealthIcon, GodFavorIcon } from './../../../../shared/Icons'

import './PlayerCard.scss'

export function PlayerCard({
  className,
  name,
  title,
  health,
  tokens
}: {
  className?: string
  name: string
  title: string
  health: number
  tokens: number
}) {
  const classes = classNames('player-card', className)

  return (
    <div className={classes}>
      <img
        alt={name}
        className="player-card__avatar"
        src="https://avatarfiles.alphacoders.com/252/thumb-1920-252736.jpg"
      />
      <div className="player-card__personal">
        <h2>{name}</h2>
        <span>{title}</span>
      </div>
      <div className="player-card__stat player-card__stat--health">
        <HealthIcon />
        <span>{health}</span>
      </div>
      <div className="player-card__stat player-card__stat--tokens">
        <GodFavorIcon />
        <span>{tokens}</span>
      </div>
    </div>
  )
}
