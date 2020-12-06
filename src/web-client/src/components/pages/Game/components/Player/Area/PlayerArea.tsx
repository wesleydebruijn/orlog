import classNames from 'classnames'
import React from 'react'

import { Player } from '../../../../../../types/types'

import './PlayerArea.scss'

type Props = {
  children: (player: Player) => React.ReactNode
  self?: boolean
  player: Player
}

export default function PlayerArea({ children, self = false, player }: Props) {
  const classes = classNames('player-area', {
    'player-area--self': self
  })
  return <div className={classes}>{children(player)}</div>
}
