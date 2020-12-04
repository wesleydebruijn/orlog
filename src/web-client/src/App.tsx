import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { GameProvider } from "./providers/GameProvider/GameProvider";

import PrivateRoute from "./components/shared/PrivateRoute";
import Dashboard from "./components/pages/Dashboard";
import Game from "./components/pages/Game";
import Login from "./components/pages/Login";

export default function App() {
  return (
    <Router>
      <GameProvider>
        <div className="orlog">
          <Switch>
            <PrivateRoute path="/" exact>
              <Dashboard />
            </PrivateRoute>

            <PrivateRoute path="/game/:id" exact>
              <Game />
            </PrivateRoute>

            <Route path="/login" exact>
              <Login />
            </Route>
          </Switch>
        </div>
      </GameProvider>
    </Router>
  );
}
