import { createSelector } from 'reselect'
import { GameLobby } from '../types/types'

export const getGameUUID = (state: GameLobby) => state.uuid
export const getSettings = (state: GameLobby) => state.settings
export const getStatus = (state: GameLobby) => state.status
export const getTurn = (state: GameLobby) => state.turn

export const getGame = (state: GameLobby) => state.game
export const getGameSettings = (state: GameLobby) => state.game.settings
export const getGameTurn = (state: GameLobby) => state.game.turn
export const getRound = (state: GameLobby) => state.game.round
export const getPhase = (state: GameLobby) => state.game.phase
export const getPlayers = (state: GameLobby) => state.game.players

export const getPlayer = createSelector(getPlayers, getTurn, (players, turn) => players[turn])
export const getOpponentPlayer = createSelector(getPlayers, getPlayer, (players, player) =>
  Object.values(players).find(opponent => opponent !== player)
)
