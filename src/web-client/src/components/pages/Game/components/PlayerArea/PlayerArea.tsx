import classNames from 'classnames'
import React from 'react'
import { usePlayer } from '../../../../../hooks/usePlayer'
import { GameActions } from '../../../../../providers/GameLobbyProvider'

import Player from '../../../../shared/Player/GamePlayer'
import DiceGrid from '../Dice/DiceGrid/DiceGrid'
import FavorArea from '../Favor/FavorArea/FavorArea'

import './PlayerArea.scss'

type Props = {
  onSelectFavor?: GameActions['selectFavor']
  onToggleDice?: GameActions['toggleDice']
}

export default function PlayerArea({ onSelectFavor, onToggleDice }: Props) {
  const { self, player } = usePlayer()
  const classes = classNames('player-area', {
    'player-area--self': self
  })

  return (
    <div className={classes}>
      <div className="wrapper wrapper--flex">
        <Player
          tokens={player.tokens}
          name="Wesley"
          avatar="https://images.ctfassets.net/cnu0m8re1exe/621LK0hTGKrRBzXdnqiuuE/e82b6415d8dec51658f2acd6ea6b70b7/viking.jpg?w=650&h=433&fit=fill"
          health={player.health}
        />
        <FavorArea onFavorSelect={self ? onSelectFavor : undefined} />
      </div>
      <DiceGrid onToggleDice={self && player.rolled ? onToggleDice : undefined} />
    </div>
  )
}
