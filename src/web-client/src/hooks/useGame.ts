import { useContext } from "react";

import { Context } from "../providers/GameProvider/GameProvider";

export function useGame() {
  const context = useContext(Context);

  if (context) {
    const { dispatch, state } = context;

    return {
      init: () => {
        dispatch({
          type: "INIT"
        });
      },
      joinGame: (gameId: string) => {
        dispatch({
          type: "JOIN_GAME",
          payload: {
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