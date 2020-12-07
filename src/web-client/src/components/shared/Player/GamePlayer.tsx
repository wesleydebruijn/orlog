import React from 'react'

import type { Player as PlayerProps } from '../../../types/types'

import './Player.scss'

type Props = Pick<PlayerProps, 'health' | 'tokens'> & {
  name: string
  avatar: string
}

export default function GamePlayer({ name, avatar, health, tokens }: Props) {
  return (
    <div className="game-player">
      <img className="game-player__avatar" alt="" src={avatar}></img>
      <div className="game-player__name">
        <span>{name}</span>
      </div>
      <div className="game-player__tokens">{tokens}</div>
      <div className="game-player__health">{health}</div>
    </div>
  )
}
