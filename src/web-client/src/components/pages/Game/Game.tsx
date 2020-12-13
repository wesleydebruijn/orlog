<<<<<<< HEAD
import React from 'react'
<<<<<<< HEAD

import { GameLobbyProvider } from '../../../providers/GameLobbyProvider'
import { useParams } from 'react-router'
import { useUser } from '../../../hooks/useAuth'
import GameStateWaiting from './components/GameState/GameStateWaiting/GameStateWaiting'
import GameBoard from './components/GameBoard/GameBoard'
import GameStateFinished from './components/GameState/GameStateFinished'

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>()
  const { id: userId } = useUser()

  return (
    <GameLobbyProvider gameId={gameId} userId={userId}>
      {({ game, status, actions }) => {
        switch (status) {
          case 'finished':
            return <GameStateFinished won={game.lobby.game.winner === game.lobby.turn} />
          case 'waiting':
            return <GameStateWaiting />
          case 'playing':
            return <GameBoard actions={actions} />
        }
      }}
    </GameLobbyProvider>
=======
import { useParams } from 'react-router'
import Button from '../../shared/Button/Button'
import ContentBox from '../../shared/ContentBox'

=======
import classNames from 'classnames'
import React, { useState } from 'react'
>>>>>>> feat: in-progress gameboard
import { GameTopbar } from '../../shared/Topbar'

import heart from '../../../assets/icons/heart.svg'
import GodFavorIcon from '../../shared/Icons/GodFavorIcon'
import Diamond from '../../shared/Figures/Diamond'

export default function Game() {
  return (
    <div className="bg-lightGray min-h-screen flex flex-col">
      <GameTopbar title="Roll phase" />
      <div className="flex p-28 flex-grow">
        <div className="flex flex-col flex-grow w-full bg-gray">
          <div className="flex w-full flex-grow relative justify-between">
            <Player className="-top-16 -left-16" />
            <Favors className="-top-14 left-16" />
          </div>
          <div className="absolute top-1/2 right-28">
            <Diamond className="w-60 text-lightGray absolute -right-10 -top-0.5" />
            <Diamond className="w-56 text-red-600 absolute -right-8 top-0.5" />
            <span className="text-white z-10 text-large">Supah</span>
          </div>
          <div className="flex w-full flex-grow relative justify-between">
            <Player className="-bottom-16 -right-16 order-2 self-end" />
            <Favors className="bottom-12 right-16 order-1 self-end" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Player({ className }: { className?: string }) {
  const classes = classNames('flex items-center relative font-signika h-36', className)
  return (
    <div className={classes}>
      <img
        className="rounded-full z-10 border-4 border-secondary"
        src="https://avatarfiles.alphacoders.com/252/thumb-1920-252736.jpg"
        width="135"
        height="135"
      />
      <div className="border-secondary border-4 rounded bg-primary -ml-5 px-10 py-3">
        <h2 className="text-orange">Wesleydegroteeindbaas</h2>
        <span className="text-gray text-sm">King's Advisor</span>
      </div>
      <div className="absolute top-1/2 -left-7 z-20 bg-red-600 px-2 rounded flex justify-between text-white">
        <img src={heart} alt="" className="text-white fill-current mr-2" width="15" />
        <span>15</span>
      </div>
      <div className="absolute top-2/3 mt-2 -left-3 z-20 bg-orange px-2 rounded flex justify-between text-white">
        <GodFavorIcon className="text-white w-3 mr-2" />
        <span>10</span>
      </div>
    </div>
>>>>>>> feat: in-progress lobby screen
  )
}

export function Favors({ className }: { className?: string }) {
  const [openFavor, setOpenFavor] = useState(0)
  const classes = classNames('relative flex-initial w-80 h-20 font-signika', className)

  function toggleFavor(index: number) {
    if (openFavor === index) {
      setOpenFavor(0)
    } else {
      setOpenFavor(index)
    }
  }

  return (
    <div className={classes}>
      <Favor
        index={1}
        active={1 === openFavor}
        title="Thor's Strike"
        description="Deal direct damage to your opponent"
        toggleTiers={toggleFavor}
      />
      <Favor
        index={2}
        active={2 === openFavor}
        title="Brunhild's Fury"
        description="Multiply your melee attack dice"
        toggleTiers={toggleFavor}
      />
      <Favor
        index={3}
        active={3 === openFavor}
        title="Baldr's Invurnerability"
        description="Double each melee and ranged block dice"
        toggleTiers={toggleFavor}
      />
    </div>
  )
}

export function Favor({
  className,
  title,
  description,
  tiers,
  toggleTiers,
  index,
  active = false
}: {
  index: number
  className?: string
  title: string
  description: string
  active?: boolean
  toggleTiers: (index: number) => void
  tiers?: {
    text: string
    cost: number
  }[]
}) {
  const classes = classNames(
    'bg-primary px-6 py-2 border-4 rounded border-secondary flex cursor-pointer mb-1',
    className
  )
  return (
    <>
      <div className={classes} onClick={() => toggleTiers(index)}>
        <div className="flex flex-col">
          <h2 className="text-orange font-bold text-sm">{title}</h2>
          <span className="text-gray text-xs">{description}</span>
        </div>
      </div>
      {active && (
        <div className="flex flex-col justify-center -mt-1">
          <div className="bg-white border-t-2 border-b-2 border-lightGray mx-1">
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-gray">Deal 2 damage</span>
              <span className="min-w-f-50 rounded border-2 border-orange px-1 text-gray flex items-center">
                <GodFavorIcon className="text-orange w-3 mr-2" />
                10
              </span>
              <span className="rounded border-2 bg-orange text-white px-2 py-1 text-sm">
                Activate
              </span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 border-b-1 border-lightGray">
              <span className="text-gray">Deal 4 damage</span>
              <span className="min-w-f-50 rounded border-2 border-orange px-1 text-gray flex items-center">
                <GodFavorIcon className="text-orange w-3 mr-2" />5
              </span>
              <span className="rounded border-2 bg-orange text-white px-2 py-1 text-sm">
                Activate
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
