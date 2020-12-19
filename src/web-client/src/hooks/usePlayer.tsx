import { useContext } from 'react'
import { GameContext } from '../providers/GameProvider'
import { PlayerContext } from '../providers/PlayerProvider'

export function usePlayer() {
  const { lobby } = useContext(GameContext)
  const playerContext = useContext(PlayerContext)

  if (!lobby) {
    throw new Error(
      'You are trying to access player outside a Game Context; this is most likely a programmer error.'
    )
  }

  const player = playerContext.player || lobby.turn
  const opponent = playerContext.opponent || (lobby.turn % 2) + 1

  return {
    self: lobby.turn === player,
    turn: lobby.game.turn === player,
    started: lobby.game.start === player,
    won: lobby.game.winner === player,
    player: lobby.game.players[player],
    opponent: lobby.game.players[opponent],
    current: lobby.game.players[lobby.game.turn],
    favors: []
  }
}
