import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Dashboard from './components/pages/Dashboard'
import Game from './components/pages/Game'
import { GameLobbyProvider } from './providers/GameLobbyProvider'

export default function App() {
  return (
    <Router>
      <div className="orlog">
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>

          <Route path="/game/:gameId" exact>
            <GameLobbyProvider>
              <Game />
            </GameLobbyProvider>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
