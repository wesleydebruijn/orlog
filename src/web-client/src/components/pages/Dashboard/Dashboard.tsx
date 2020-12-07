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
      <main>
        <section className="news">
          <div className="news__header">
            <h2>News</h2>
          </div>
          <article className="news__article">
            <h3 className="news__article__title">Welcome to Orlog</h3>
            <span className="news__article__text">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem beatae possimus
              recusandae, libero adipisci laborum natus, iusto laboriosam animi odit omnis. Fuga,
              consequatur facilis. Et pariatur neque similique magni placeat.
            </span>
            <span className="news__article__meta">
              <span>by Sigurd Styrbjornson</span>
              <span>12/07/2020 at 11:13</span>
            </span>
          </article>
          <article className="news__article">
            <h3 className="news__article__title">Patch notes v1.0.3</h3>
            <span className="news__article__text">
              We've made it so Jeffrey always wins, no matter what. This is very important since it
              sets a statement. It's just the way it should be and will ever be.
            </span>
            <span className="news__article__meta">
              <span>by Basim Ibn Ishaq</span>
              <span>14/07/2020 at 14:24</span>
            </span>
          </article>
        </section>
        <section className="game-menu">
          <button className="game-menu__play">New game</button>
        </section>
      </main>
    </div>
  )
}
