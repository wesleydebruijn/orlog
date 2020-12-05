import React from 'react'
import { useGameLobby } from '../../hooks/useGameLobby'
import {
  getOpponentPlayer,
  getPlayer,
  getPhase,
  getRound,
  getStatus,
  getPlayerFavors,
  getOpponentFavors
} from '../../selectors/selectors'

import Dice from '../shared/Dice/Dice'

export default function Game() {
  const { state, doContinue, toggleDice, selectFavor } = useGameLobby()

  const status = getStatus(state)

  const round = getRound(state)
  const phase = getPhase(state)

  const player = getPlayer(state)
  const playerFavors = getPlayerFavors(state)

  const opponent = getOpponentPlayer(state)
  const opponentFavors = getOpponentFavors(state)

  return (
    <>
      <h2>Game: {status}</h2>
      <p>
        <b>Round:</b> {round}
        <br />
        <b>Phase:</b> {phase}
      </p>
      <p>
        <b>Opponent:</b>{' '}
        {opponent && (
          <p>
            health: {opponent.health}, tokens: {opponent.tokens}, turns: {opponent.turns}
          </p>
        )}
      </p>
      <p>
        {opponentFavors.map((favor, favorIndex) => (
          <p>
            {favor.name}:
            {Object.entries(favor.tiers).map(([tierIndex, tier]) => (
              <button onClick={() => selectFavor(favorIndex + 1, parseInt(tierIndex))}>
                {tierIndex} - {tier.value} for {tier.cost} tokens
              </button>
            ))}
          </p>
        ))}
      </p>
      <p>
        {opponent &&
          Object.entries(opponent.dices).map(([index, dice]) => (
            <Dice key={index} index={index} {...dice} />
          ))}
      </p>
      <p>
        <b>You:</b>{' '}
        {player && (
          <p>
            health: {player.health}, tokens: {player.tokens}, turns: {player.turns}
          </p>
        )}
        {state.lobby.game.turn === state.lobby.turn ? 'IK BEN' : 'IK BEN NIET'}
      </p>
      <p>
        {playerFavors.map((favor, favorIndex) => (
          <p>
            {favor.name}:
            {Object.entries(favor.tiers).map(([tierIndex, tier]) => (
              <button onClick={() => selectFavor(favorIndex + 1, parseInt(tierIndex))}>
                {tierIndex} - {tier.value} for {tier.cost} tokens
              </button>
            ))}
          </p>
        ))}
      </p>
      <p>
        {player &&
          Object.entries(player.dices).map(([index, dice]) => (
            <Dice key={index} {...dice} index={index} onClick={toggleDice} />
          ))}
      </p>
      <button onClick={() => doContinue()}>Continue</button>
    </>
  )
}
