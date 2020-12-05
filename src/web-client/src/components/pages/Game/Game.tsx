import React from 'react'

import './Game.scss'

import Player from './components/Player/Player'
import DiceGrid from './components/Dice/DiceGrid/DiceGrid'
import PlayerArea from './components/Player/Area/PlayerArea'
import FavorArea from './components/Favor/FavorArea/FavorArea'
import ContinueButton from './components/ContinueButton/ContinueButton'

export default function Game() {
  return (
    <div className="game">
      <PlayerArea>
        {() => (
          <>
            <div className="wrapper wrapper--flex">
              <Player
                name="Wesley"
                avatar="https://pbs.twimg.com/profile_images/2881587655/12a3e778fca6c632fc149683ef22b656_400x400.jpeg"
                health={15}
              />
              <FavorArea />
            </div>
            <DiceGrid />
          </>
        )}
      </PlayerArea>
      <ContinueButton text="Klik mattie" onClick={() => console.log('go next')} disabled />
      <PlayerArea self>
        {() => (
          <>
            <div className="wrapper wrapper--flex">
              <Player
                name="Jeffrey"
                avatar="https://pbs.twimg.com/profile_images/2881587655/12a3e778fca6c632fc149683ef22b656_400x400.jpeg"
                health={15}
              />
              <FavorArea />
            </div>
            <DiceGrid />
          </>
        )}
      </PlayerArea>
    </div>
  )
}
