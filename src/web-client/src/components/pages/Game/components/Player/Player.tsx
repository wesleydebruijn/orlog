import React from 'react'

import type { Player as PlayerProps } from '../../../../../types/types'

import './Player.scss'

type Props = Pick<PlayerProps, 'health'> & {
  name: string
  avatar: string
}

export default function Player({ name, avatar, health }: Props) {
  return (
    <div className="player">
      <img className="player__avatar" alt="" src={avatar}></img>
      <div className="player__name">
        <span>{name}</span>
      </div>
      <div className="player__health">{health}</div>
    </div>
  )
}
