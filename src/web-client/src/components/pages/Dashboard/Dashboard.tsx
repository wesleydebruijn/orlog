import React from 'react'
import Player from '../../shared/Player/Player'
import Topbar from '../../shared/Topbar/Topbar'
import Navigation from './components/Navigation'

import godFavorIcon from '../Dashboard/assets/icons/god_favors.svg'
import userIcon from '../Dashboard/assets/icons/user.svg'

export default function Dashboard() {
  return (
    <div className="w-full h-screen bg-dashboard">
      <Topbar>
        <Player />
        <Navigation
          items={[
            { text: 'God Favors', icon: godFavorIcon },
            { text: 'Settings', icon: userIcon }
          ]}
        />
      </Topbar>
      <div
        className="flex absolute top-1/4 left-1/2 width-1/2"
        style={{
          transform: 'translate(-50%, -50%)'
        }}
      ></div>
    </div>
  )
}
