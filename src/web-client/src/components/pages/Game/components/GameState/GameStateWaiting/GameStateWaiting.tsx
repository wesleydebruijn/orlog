import React from 'react'
import { useParams } from 'react-router'

import Topbar from '../../../../../shared/Topbar/Topbar'

import './GameStateWaiting.scss'

export default function GameStateWaiting() {
  const { gameId } = useParams<{ gameId: string }>()

  return (
    <div className="game-state-waiting">
      <Topbar title="Waiting for opponent..." />
      <main>
        <h1>Invite a friend</h1>
        <p>
          By sharing this link with a friend, cat or dog you can play against them and most likely
          defeat them because they probably don't know to play it yet anyway. Definitely your pet
          though.
        </p>
        <input
          type="text"
          readOnly={true}
          defaultValue={`${process.env.REACT_APP_BASE_URL}/game/${gameId}`}
        />
        <section className="game-state-waiting__actions">
          <button>copy</button>
          <button>share</button>
        </section>
      </main>
    </div>
  )
}
