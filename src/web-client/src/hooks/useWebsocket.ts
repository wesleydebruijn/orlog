import { useContext } from "react";

import { WebsocketContext } from "../providers/WebsocketProvider";

export function useWebsocket() {
  const context = useContext(WebsocketContext);

  if (context) {
    const { dispatch, state } = context;

    return {
      init: () => {
        dispatch({
          type: "INIT"
        });
      },
      joinGame: (gameId: string, playerId: string) => {
        dispatch({
          type: "JOIN_GAME",
          payload: {
            playerId,
            gameId
          }
        })
      },
      state
    }
  } else {
    throw new Error("Trying to access Websocket state without it existing");
  }
}