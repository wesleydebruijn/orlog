import React from 'react'

import godFavorIcon from '../../assets/icons/god_favors.svg'
import userIcon from '../../assets/icons/user.svg'

import './Navigation.scss'

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="navigation__item">
        <div className="navigation__item__icon">
          <img className="icon--god-favors" src={godFavorIcon} alt="" />
        </div>
        <span className="navigation__item__text">God Favors</span>
      </div>

      <div className="navigation__item">
        <div className="navigation__item__icon">
          <img className="icon--settings" src={userIcon} alt="" />
        </div>
        <span className="navigation__item__text">Settings</span>
      </div>
    </nav>
  )
}
