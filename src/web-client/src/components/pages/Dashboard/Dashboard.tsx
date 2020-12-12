import React from 'react'
import { useHistory } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import Player from '../../shared/Player'
import Topbar from '../../shared/Topbar'
import Navigation from './components/Navigation'
import News from './components/News'
import FancyButton from '../../shared/Button/FancyButton'

import godFavorIcon from '../../../assets/icons/god_favors.svg'
import userIcon from '../../../assets/icons/user.svg'

export default function Dashboard() {
  const history = useHistory()
  function createGame() {
    const gameId = uuidv4()
    history.push(`/game/${gameId}`)
  }

  return (
    <div className="w-full min-h-screen bg-dashboard bg-center bg-cover bg-no-repeat bg-fixed flex flex-col">
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
              onClick={() => createGame()}
            >
              New game
            </FancyButton>
          </div>
        </div>
      </div>
    </div>
  )
}
