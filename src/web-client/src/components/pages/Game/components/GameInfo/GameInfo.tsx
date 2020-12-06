import React from 'react'

import './GameInfo.scss'

type Props = {
  phase: string
  turn: number
  maxTurn: number
  round: number
}

export default function GameInfo({ phase, turn, maxTurn, round }: Props) {
  return (
    <section className="game-info">
      <div className="game-info__phase">{phase} phase</div>
      <div className="game-info__info">
        <span className="game-info__info__turn">
          turns {turn}/{maxTurn}
        </span>
        <span className="game-info__info__round">round {round}</span>
      </div>
    </section>
  )
}
