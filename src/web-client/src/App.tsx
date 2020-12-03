import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { WebsocketProvider } from "./providers/WebsocketProvider";

import Dashboard from "./components/pages/Dashboard";
import Game from "./components/pages/Game";

export default function App() {
  return (
    <Router>
      <WebsocketProvider>
        <div className="orlog">
          <Switch>
            <Route path="/" exact>
              <Dashboard />
            </Route>

            <Route path="/game/:id" exact>
              <Game />
            </Route>
          </Switch>
        </div>
      </WebsocketProvider>
    </Router>
  );
}
