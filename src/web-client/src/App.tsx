import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { GameProvider } from './providers/GameLobbyProvider'
import { AuthProvider } from './providers/AuthProvider'
import PrivateRoute from './components/shared/PrivateRoute'

import Dashboard from './components/pages/Dashboard'
import Game from './components/pages/Game/Game'
import Login from './components/pages/Login'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="orlog">
          <Switch>
            <PrivateRoute path="/" exact>
              <Dashboard />
            </PrivateRoute>

            <PrivateRoute path="/game/:gameId" exact>
              <GameProvider>
                <Game />
              </GameProvider>
            </PrivateRoute>

            <Route path="/login" exact>
              <Login />
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  )
}
