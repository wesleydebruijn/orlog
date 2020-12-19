import React from 'react'

import { useGame } from '../../../../../hooks/useGame'

import ContinueButton from '../ContinueButton/ContinueButton'
import GameInfo from '../GameInfo/GameInfo'
import PlayerArea from '../PlayerArea/PlayerArea'

import './GameBoard.scss'
import { PlayerProvider } from '../../../../../providers/PlayerProvider'

export default function GameBoard() {
  const { player, opponent, actions } = useGame()
  const { doContinue, selectFavor, toggleDice } = actions

  return (
    <section className="game-board">
      <GameInfo />
      <section className="game-board__field">
        <PlayerProvider player={opponent} opponent={player}>
          <PlayerArea />
        </PlayerProvider>
        <PlayerProvider player={player} opponent={opponent}>
          <PlayerArea onSelectFavor={selectFavor} onToggleDice={toggleDice} />
        </PlayerProvider>
        <ContinueButton onClick={() => doContinue()} />
      </section>
    </section>
  )
}
