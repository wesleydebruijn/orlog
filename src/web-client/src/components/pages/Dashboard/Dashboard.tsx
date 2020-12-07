import React from 'react'
import { useHistory } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import Navigation from './components/Navigation/Navigation'
import News from './components/News/News'
import Player from '../../shared/Player/Player'

import './Dashboard.scss'

export default function Dashboard() {
  const history = useHistory()

  function createGame() {
    const gameId = uuidv4()
    history.push(`/game/${gameId}`)
  }

  return (
    <div className="dashboard">
      <section className="topbar">
        <div className="container">
          <Player />
          <Navigation />
        </div>
      </section>
      <main>
        <News />
        <section className="game-menu">
          <button className="game-menu__play" onClick={() => createGame()}>
            New game
          </button>
        </section>
        <section className="empty"></section>
      </main>
    </div>
  )
}
