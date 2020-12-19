import React from 'react'

import { useGame } from '../../../../../hooks/useGame'

import ContinueButton from '../ContinueButton/ContinueButton'

import './GameBoard.scss'
import { PlayerProvider } from '../../../../../providers/PlayerProvider'
import Topbar from '../../../../shared/Topbar/Topbar'
import { usePlayer } from '../../../../../hooks/usePlayer'
import classNames from 'classnames'
import { PlayerCard } from '../PlayerCard/PlayerCard'
import DiceGrid from '../Dice/DiceGrid/DiceGrid'
import FavorArea from '../Favor/FavorArea/FavorArea'

export default function GameBoard() {
  const { player, opponent, phase, actions } = useGame()
  const { doContinue, selectFavor, toggleDice } = actions

  return (
    <section className="game-board">
      <Topbar variant="game" title={`${phase.name} phase`} />
      <section className="game-board__field">
        <div className="game-board__field-bg">
          <PlayerProvider player={opponent} opponent={player}>
            <PlayerArea />
          </PlayerProvider>
          <PlayerProvider player={player} opponent={opponent}>
            <PlayerArea />
          </PlayerProvider>
          <ContinueButton onClick={() => doContinue()} />
        </div>
      </section>
    </section>
  )
}

export function PlayerArea() {
  const { player, self } = usePlayer()

  const classes = classNames('player-area', {
    'player-area--self': self
  })

  return (
    <section className={classes}>
      <div className="wrapper wrapper--flex">
        <PlayerCard
          name={player.user.name}
          title={player.user.title}
          health={player.health}
          tokens={player.tokens}
        />
        <FavorArea />
      </div>
      <DiceGrid />
    </section>
  )
}
