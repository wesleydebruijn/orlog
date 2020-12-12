import { useContext } from 'react'
import { Context } from '../providers/GameLobbyProvider'

export function useGame() {
  const { lobby } = useContext(Context)

  if (!lobby) {
    throw new Error(
      'You are trying to access game outside a Game Context; this is most likely a programmer error.'
    )
  }

  return {
    phase: {
      id: lobby.game.phase,
      ...lobby.game.settings.phases[lobby.game.phase]
    },
    round: lobby.game.round,
    turn: lobby.game.turn
  }
}
