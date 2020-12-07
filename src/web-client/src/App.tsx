import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { AuthProvider } from './providers/AuthProvider'
import PrivateRoute from './components/shared/PrivateRoute'

import Dashboard from './components/pages/Dashboard/Dashboard'
import Game from './components/pages/Game/Game'
import Login from './components/pages/Login'
import Test from './components/pages/Test'

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
              <Game />
            </PrivateRoute>

            <Route path="/login" exact>
              <Login />
            </Route>

            <Route path="/test" exact>
              <Test />
            </Route>
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  )
}
