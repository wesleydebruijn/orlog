import React from 'react'

import { useGame } from '../../../../../hooks/useGame'

import ContinueButton from '../ContinueButton/ContinueButton'
import PlayerArea from '../PlayerArea/PlayerArea'

import './GameBoard.scss'
import { PlayerProvider } from '../../../../../providers/PlayerProvider'
import Topbar from '../../../../shared/Topbar/Topbar'

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
            <PlayerArea onSelectFavor={selectFavor} onToggleDice={toggleDice} />
          </PlayerProvider>
          <ContinueButton onClick={() => doContinue()} />
        </div>
      </section>
    </section>
  )
}
