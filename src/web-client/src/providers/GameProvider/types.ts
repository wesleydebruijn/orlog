import type { Action } from "../../reducers/game";

export type GameStateAuthorized = {
  socket: WebSocket;
  player: {
    id: string;
    name: string;
  };
};

export type GameStateInitial = {
  player: {
    id: undefined;
    name: undefined;
  };
  socket: undefined;
};

export type GameState = GameStateInitial | GameStateAuthorized;
export type GameContext = {
  state: GameState;
  dispatch: (action: Action) => void;
};