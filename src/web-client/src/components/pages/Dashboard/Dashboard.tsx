import { useHistory } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import godFavorIcon from './assets/icons/god_favors.svg'
import userIcon from './assets/icons/user.svg'

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
          <nav className="menu">
            <div className="menu__item">
              <img
                className="menu__item__icon menu__item__icon--god-favors"
                src={godFavorIcon}
                alt=""
              />
              <span className="menu__item__text">God Favors</span>
            </div>

            <div className="menu__item">
              <img className="menu__item__icon menu__item__icon--settings" src={userIcon} alt="" />
              <span className="menu__item__text">Settings</span>
            </div>
          </nav>
        </div>
      </section>
    </div>
  )
}
