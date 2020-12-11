import React from 'react'

import type { NewGameState, Player } from '../../../../../types/types'
import type { GameActions } from '../../../../../providers/GameLobbyProvider'

import ContinueButton from '../ContinueButton/ContinueButton'
import GameInfo from '../GameInfo/GameInfo'
import PlayerArea from '../PlayerArea/PlayerArea'
import {
  getGamePhase,
  getCurrentPlayer,
  getOpponentPlayer,
  getPlayerFavors,
  getPlayer
} from '../../../../../selectors/selectors'

import './GameBoard.scss'
import { useGame } from '../../../../../hooks/useGame'

type Props = {
  game: NewGameState
  actions: GameActions
}

export const PlayerContext = React.createContext<{ player?: number; opponent?: number }>({
  player: undefined,
  opponent: undefined
})

export default function GameBoard({ game, actions }: Props) {
  const { phase } = useGame()

  return (
    <section className="game-board">
      <GameInfo
        phase={phase.name}
        turn={phase.turns - phase.auto_turns + 1 - getCurrentPlayer(game).turns}
        maxTurn={phase.turns - phase.auto_turns}
        round={game.lobby.game.round}
      />
      <section className="game-board__field">
        {Object.entries(game.lobby.game.players)
          .sort(([index, _player]) => (parseInt(index) === game.lobby.turn ? 1 : -1))
          .map(([index, player]) => (
            <PlayerContext.Provider
              value={{ player: parseInt(index), opponent: (parseInt(index) % 2) + 1 }}
            >
              <PlayerArea
                key={index}
                onSelectFavor={actions.selectFavor}
                onToggleDice={actions.toggleDice}
              />
            </PlayerContext.Provider>
          ))}
        {game.lobby.turn === game.lobby.game.turn && (
          <ContinueButton text="Continue" onClick={() => actions.doContinue()} />
        )}
      </section>
    </section>
  )
}