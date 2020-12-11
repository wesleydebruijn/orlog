import { useContext } from 'react'
import { PlayerContext } from '../components/pages/Game/components/GameBoard/GameBoard'
import { Context } from '../providers/GameLobbyProvider'

export function usePlayer() {
  const { lobby } = useContext(Context)
  const { player, opponent } = useContext(PlayerContext)

  if (!player || !opponent || !lobby) {
    throw new Error(
      'You are trying to access player outside a Game Context; this is most likely a programmer error.'
    )
  }

  return {
    self: lobby.turn === player,
    turn: lobby.game.turn === player,
    started: lobby.game.start === player,
    won: lobby.game.winner === player,
    player: lobby.game.players[player],
    opponent: lobby.game.players[opponent]
  }
}
