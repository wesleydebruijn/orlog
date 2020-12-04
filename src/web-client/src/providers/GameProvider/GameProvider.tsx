import React, { Reducer, useReducer } from "react";

import reducer, { Action } from "../../reducers/game";
import type { GameStateInitial, GameContext, GameState } from "./types";

const initialState: GameStateInitial = {
  socket: undefined,
  player: {
    id: undefined,
    name: undefined,
  },
};

export const Context = React.createContext<GameContext>({
  state: initialState,
  dispatch: () => {},
});

type GameProviderProps = {
  children: React.ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  // @ts-ignore
  const [state, dispatch] = useReducer<Reducer<GameState, Action>>(reducer, initialState);
  const contextValue = { state, dispatch };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
}
