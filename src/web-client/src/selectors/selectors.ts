import { createSelector } from 'reselect'
import { GameState } from '../types/types'

export const getGameUUID = (state: GameState) => state.lobby.uuid
export const getSettings = (state: GameState) => state.lobby.settings
export const getStatus = (state: GameState) => state.lobby.status
export const getTurn = (state: GameState) => state.lobby.turn

export const getGame = (state: GameState) => state.lobby.game
export const getGameSettings = (state: GameState) => state.lobby.game.settings
export const getGameTurn = (state: GameState) => state.lobby.game.turn
export const getRound = (state: GameState) => state.lobby.game.round
export const getPhase = (state: GameState) => state.lobby.game.phase
export const getPlayers = (state: GameState) => state.lobby.game.players

export const getFavors = (state: GameState) => state.favors

export const getPlayer = createSelector(getPlayers, getTurn, (players, turn) => players[turn])
export const getOpponentPlayer = createSelector(getPlayers, getPlayer, (players, player) =>
  Object.values(players).find(opponent => opponent !== player)
)
