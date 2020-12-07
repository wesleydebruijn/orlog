import React from 'react'

import type { NewGameState } from '../../../../../types/types'
import type { GameActions } from '../../../../../providers/GameLobbyProvider'

import ContinueButton from '../ContinueButton/ContinueButton'
import GameInfo from '../GameInfo/GameInfo'
import PlayerArea from '../PlayerArea/PlayerArea'
import {
  getGamePhase,
  getCurrentPlayer,
  getOpponentPlayer,
  getPlayer,
  getPlayerFavors
} from '../../../../../selectors/selectors'

import './GameBoard.scss'

type Props = {
  game: NewGameState
  actions: GameActions
}

export default function GameBoard({ game, actions }: Props) {
  return (
    <section className="game-board">
      <GameInfo
        phase={getGamePhase(game).name}
        turn={
          getGamePhase(game).turns -
          getGamePhase(game).auto_turns +
          1 -
          getCurrentPlayer(game).turns
        }
        maxTurn={getGamePhase(game).turns - getGamePhase(game).auto_turns}
        round={game.lobby.game.round}
      />
      <section className="game-board__field">
        {[getOpponentPlayer(game), getPlayer(game)].map((player, index) => (
          <PlayerArea
            favors={getPlayerFavors(game)}
            key={index}
            player={player}
            self={index === 1}
            onSelectFavor={actions.selectFavor}
            onToggleDice={actions.toggleDice}
          ></PlayerArea>
        ))}
        {game.lobby.turn === game.lobby.game.turn && (
          <ContinueButton text="Continue" onClick={() => actions.doContinue()} />
        )}
      </section>
    </section>
  )
}
