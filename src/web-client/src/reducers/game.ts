import { v4 as uuidv4 } from "uuid";

import type { GameState } from "../providers/GameProvider/types";

export const WEBSOCKET_INIT = "INIT";
export const WEBSOCKET_JOIN_GAME = "JOIN_GAME";

type InitAction = {
  type: typeof WEBSOCKET_INIT;
};

type CreateAction = {
  type: typeof WEBSOCKET_JOIN_GAME;
  payload: {
    gameId: string;
  };
};

export type Action = InitAction | CreateAction;

export default function GameReducer(state: GameState, action: Action) {
  switch (action.type) {
    case "INIT": {
      let playerId = localStorage.getItem("orlog:playerid");
      if (playerId === null) {
        playerId = uuidv4();
        localStorage.setItem("orlog:playerid", playerId);
      }

      return {
        ...state,
        player: {
          id: playerId,
          name: "Anonymous", // Maybe a random viking name!
        },
      };
    }
    case "JOIN_GAME":
      const {
        player: { id: playerId },
      } = state;
      const { gameId } = action.payload;
      console.log(gameId, playerId);
      return {
        ...state,
        socket: new WebSocket(`ws://localhost:4000/ws/${gameId}/${playerId}`),
      };
  }
};
