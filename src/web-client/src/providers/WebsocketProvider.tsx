import React, { useReducer } from "react";

import reducer, { Action } from "../reducers/websocket";

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

type WebsocketState = WebsocketStateInitial | WebsocketStateInitiated;
type WebsocketContext = {
  state: WebsocketState;
  dispatch: (action: Action) => void;
};

const initialState: WebsocketStateInitial = {
  socket: undefined,
  user: {
    id: undefined,
    name: undefined,
  },
};

export const WebsocketContext = React.createContext<WebsocketContext>({
  state: initialState,
  dispatch: () => {},
});

type WebsocketProviderProps = {
  children: React.ReactNode;
};

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  // TODO: correct typing
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = { state, dispatch };

  return (
    <WebsocketContext.Provider value={contextValue}>
      {children}
    </WebsocketContext.Provider>
  );
}
