import { useContext } from 'react'
import { GameContext } from '../providers/GameProvider'

export function useGame() {
  const { lobby, actions } = useContext(GameContext)

  if (!lobby || !actions) {
    throw new Error(
      'You are trying to access game outside a Game Context; this is most likely a programmer error.'
    )
  }

  return {
    phase: {
      ...lobby.game.settings.phases[lobby.game.phase],
      id: lobby.game.phase
    },
    round: lobby.game.round,
    turn: lobby.game.turn,
    hasTurn: lobby.game.turn === lobby.turn,
    player: lobby.turn,
    opponent: (lobby.turn % 2) + 1,
    actions
  }
}
