import { createSelector } from 'reselect';
import { getUserId } from './helpers/identifiers';
import { GameLobby } from './types';

export const getGameUUID = (state: GameLobby) => state.uuid;
export const getSettings = (state: GameLobby) => state.settings;

export const getGame = (state: GameLobby) => state.game;
export const getGameSettings = (state: GameLobby) => state.game.settings;
export const getTurn = (state: GameLobby) => state.game.turn;
export const getRound = (state: GameLobby) => state.game.round;
export const getPhase = (state: GameLobby) => state.game.phase;
export const getPlayers = (state: GameLobby) => state.game.players;

export const getPlayer = createSelector(
  getPlayers,
  (players) => Object.values(players).find(player => player.uuid === getUserId())
);

export const getOpponentPlayer = createSelector(
  getPlayers,
  (players) => Object.values(players).find(player => player.uuid !== getUserId())
);

export const hasTurn = createSelector(
  getPlayers,
  getTurn,
  (players, turn) => players[turn].uuid === getUserId()
);