import classNames from 'classnames'
import React from 'react'

import { HealthIcon, GodFavorIcon } from './../../../../shared/Icons'

import './PlayerCard.scss'

export function PlayerCard({
  className,
  avatar = 'https://avatarfiles.alphacoders.com/252/thumb-1920-252736.jpg',
  name,
  title,
  health,
  tokens,
  placeholder = false
}: {
  className?: string
  avatar?: string | React.ReactNode
  name: string
  title?: string
  health?: number
  tokens?: number
  placeholder?: boolean
}) {
  const classes = classNames('player-card', className, {
    'player-card--placeholder': placeholder
  })

  const avatarElement =
    typeof avatar === 'string' ? (
      <img alt={name} className="player-card__avatar" src={avatar} />
    ) : (
      <div className="player-card__avatar">{avatar}</div>
    )

  return (
    <div className={classes}>
      {avatarElement}
      <div className="player-card__personal">
        <h2>{name}</h2>
        {title && <span>{title}</span>}
      </div>
      {health !== undefined && (
        <div className="player-card__stat player-card__stat--health">
          <HealthIcon />
          <span>{health}</span>
        </div>
      )}
      {tokens !== undefined && (
        <div className="player-card__stat player-card__stat--tokens">
          <GodFavorIcon />
          <span>{tokens}</span>
        </div>
      )}
    </div>
  )
}
