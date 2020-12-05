import classNames from 'classnames'
import React, { Children } from 'react'
import Player from '../Player'

import './PlayerArea.scss'

type Props = {
  children: () => React.ReactNode
  self?: boolean
}

export default function PlayerArea({ children, self = false }: Props) {
  const classes = classNames('player-area', {
    'player-area--self': self
  })
  return <div className={classes}>{children()}</div>
}
