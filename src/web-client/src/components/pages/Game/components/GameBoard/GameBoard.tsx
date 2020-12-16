import React from 'react'

import type { GameActions } from '../../../../../providers/GameLobbyProvider'
import { useGame } from '../../../../../hooks/useGame'

import ContinueButton from '../ContinueButton/ContinueButton'
import GameInfo from '../GameInfo/GameInfo'
import PlayerArea from '../PlayerArea/PlayerArea'

import './GameBoard.scss'

type Props = {
  actions: GameActions
}

export const PlayerContext = React.createContext<{ player?: number; opponent?: number }>({
  player: undefined,
  opponent: undefined
})

export default function GameBoard({ actions }: Props) {
  const { toggleDice, selectFavor, doContinue } = actions
  const { player, opponent } = useGame()

  return (
    <section className="game-board">
      <GameInfo />
      <section className="game-board__field">
        <PlayerContext.Provider value={{ player: opponent, opponent: player }}>
          <PlayerArea onSelectFavor={selectFavor} onToggleDice={toggleDice} />
        </PlayerContext.Provider>
        <PlayerContext.Provider value={{ player, opponent }}>
          <PlayerArea onSelectFavor={selectFavor} onToggleDice={toggleDice} />
        </PlayerContext.Provider>
        <ContinueButton onClick={() => doContinue()} />
      </section>
    </section>
  )
}
