import React from 'react'
import Player from '../../shared/Player'
import Topbar from '../../shared/Topbar'
import Navigation from './components/Navigation'

import godFavorIcon from '../Dashboard/assets/icons/god_favors.svg'
import userIcon from '../Dashboard/assets/icons/user.svg'
import News from './components/News'
import FancyButton from '../../shared/Button/FancyButton'

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen bg-dashboard flex flex-col">
      <Topbar>
        <Player />
        <Navigation
          items={[
            { text: 'God Favors', icon: godFavorIcon },
            { text: 'Settings', icon: userIcon }
          ]}
        />
      </Topbar>
      <div className="container mx-auto flex px-2 justify-center flex-grow items-center mobile:mt-8 mobile:w-full mobile:px-12">
        <div className="w-2/3 flex justify-between mobile:flex-col mobile:w-full">
          <News className="mobile:order-2 mobile:mb-8 flex-initial min-w-f-300" />
          <div className="flex-grow">
            <FancyButton
              className="mobile:order-1 mobile:mb-8 mobile:w-full tablet:ml-8"
              onClick={() => console.log('hey')}
            >
              New game
            </FancyButton>
          </div>
          <div className="w-1/3"></div>
        </div>
      </div>
    </div>
  )
}
