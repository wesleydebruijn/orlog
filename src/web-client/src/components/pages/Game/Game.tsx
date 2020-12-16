import React from 'react'

import { GameTopbar } from '../../shared/Topbar'
import { GameButton } from './components/Button'
import { Dices } from './components/Dice'
import { Favors } from './components/Favor'
import { Player } from './components/Player'

export default function Game() {
  return (
    <div className="bg-lightGray min-h-screen flex flex-col">
      <GameTopbar title="Roll phase" />
      <div className="flex px-28 py-20 flex-grow">
        <div className="flex flex-col flex-grow w-full bg-gray">
          <div className="flex flex-col relative justify-between flex-initial h-1/2">
            <div className="flex flex-grow justify-between">
              <Player className="-top-16 -left-16" />
              <Favors className="-top-14 left-16" />
            </div>
            <Dices />
          </div>
          <GameButton>Supah</GameButton>
          <div className="flex flex-col relative justify-between flex-initial h-1/2">
            <Dices />
            <div className="flex flex-grow justify-between">
              <Player className="-bottom-16 -right-16 order-2 self-end" />
              <Favors className="bottom-14 right-16 order-1 self-end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
