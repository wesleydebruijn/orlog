import React from 'react'
import { useGameLobby } from '../../hooks/useGameLobby'
import {
  getOpponentPlayer,
  getPlayer,
  getPhase,
  getRound,
  getStatus
} from '../../selectors/selectors'

import Dice from '../shared/Dice/Dice'

export default function Game() {
  const { state, doContinue, toggleDice } = useGameLobby()

  const status = getStatus(state)

  const round = getRound(state)
  const phase = getPhase(state)

  const player = getPlayer(state)
  const opponent = getOpponentPlayer(state)

  return (
    <>
      <h2>Game: {status}</h2>
      <p>
        <b>Round:</b> {round}
        <br />
        <b>Phase:</b> {phase}
      </p>
      <p>
        <b>You are:</b> {player && player.health}{' '}
        {state.game.turn === state.turn ? 'IK BEN' : 'IK BEN NIET'}
      </p>
      <p>
        {player &&
          Object.entries(player.dices).map(([index, dice]) => (
            <Dice key={index} {...dice} index={index} onClick={toggleDice} />
          ))}
      </p>
      <p>
        <b>Your opponent is:</b> {opponent && opponent.health}
      </p>
      <p>
        {opponent &&
          Object.entries(opponent.dices).map(([index, dice]) => (
            <Dice key={index} index={index} {...dice} />
          ))}
      </p>
      <button onClick={() => doContinue()}>Continue</button>
    </>
  )
}
