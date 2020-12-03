import { v4 as uuidv4 } from "uuid";

type WebsocketStateInitiated = {
  socket: WebSocket;
  user: {
    id: string;
    name: string;
  };
};

type WebsocketStateInitial = {
  user: {
    id: undefined;
    name: undefined;
  };
  socket: undefined;
};

export const WEBSOCKET_INIT = "INIT";
export const WEBSOCKET_JOIN_GAME = "JOIN_GAME";

type InitAction = {
  type: typeof WEBSOCKET_INIT;
};

type CreateAction = {
  type: typeof WEBSOCKET_JOIN_GAME;
  payload: {
    gameId: string;
    playerId: string;
  };
};

export type Action = InitAction | CreateAction;
type WebsocketState = WebsocketStateInitial | WebsocketStateInitiated;

export default (state: WebsocketState, action: Action) => {
  switch (action.type) {
    case "INIT":
      let userId = localStorage.getItem("orlog:userid");
      if (userId === null) {
        userId = uuidv4();
        localStorage.setItem("orlog:playerid", userId);
      }

      return {
        socket: undefined,
        user: {
          id: userId,
          name: "Anonymous", // Maybe a random viking name!
        },
      };
    case "JOIN_GAME":
      const { gameId, playerId } = action.payload;

      return {
        ...state,
        socket: new WebSocket(`ws://localhost:4000/ws/${gameId}/${playerId}`),
      };
  }
};
