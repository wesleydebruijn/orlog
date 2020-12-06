import { createSelector } from 'reselect'
import { NewGameState } from '../types/types'

export const getGameUUID = (state: NewGameState) => state.lobby.uuid
export const getSettings = (state: NewGameState) => state.lobby.settings
export const getStatus = (state: NewGameState) => state.lobby.status
export const getTurn = (state: NewGameState) => state.lobby.turn

export const getGame = (state: NewGameState) => state.lobby.game
export const getGameSettings = (state: NewGameState) => state.lobby.game.settings
export const getGameTurn = (state: NewGameState) => state.lobby.game.turn
export const getRound = (state: NewGameState) => state.lobby.game.round
export const getPhase = (state: NewGameState) => state.lobby.game.phase
export const getPlayers = (state: NewGameState) => state.lobby.game.players

export const getFavors = (state: NewGameState) => state.favors

export const getPlayer = createSelector(getPlayers, getTurn, (players, turn) => players[turn])
export const getPlayerFavors = createSelector(getPlayer, getFavors, (player, favors) => {
  if (!favors || !player) return []

  return Object.values(player.favors).map(index => favors[index])
})

export const getOpponentPlayer = createSelector(
  getPlayers,
  getTurn,
  (players, turn) => players[(turn % 2) + 1]
)
export const getOpponentFavors = createSelector(getOpponentPlayer, getFavors, (player, favors) => {
  if (!favors || !player) return []

  return Object.values(player.favors).map(index => favors[index])
})
