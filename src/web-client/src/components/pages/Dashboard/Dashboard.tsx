import React from 'react'
import { useHistory } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import Navigation from './components/Navigation/Navigation'

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
          <section className="player">
            <div className="player__avatar">
              <img
                src="https://www.nationalgeographic.com/content/dam/news/2018/01/19/viking/01-viking-NationalGeographic_2515792.ngsversion.1516396230234.adapt.1900.1.jpg"
                alt=""
              />
            </div>
            <div className="player__info">
              <span className="player__info__name">Wesley</span>
              <span className="player__info__title">The Devil's Advocate</span>
            </div>
          </section>
          <Navigation />
        </div>
      </section>
    </div>
  )
}
