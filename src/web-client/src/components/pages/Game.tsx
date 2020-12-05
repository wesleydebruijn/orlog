import { useGameLobby } from '../../hooks/useGameLobby'
import {
  getOpponentPlayer,
  getPlayer,
  getPhase,
  getRound,
  getStatus
} from '../../selectors/selectors'

export default function Game() {
  const { state } = useGameLobby()

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
        <b>You are:</b> {player && player.health}
      </p>
      <p>
        <b>Your opponent is:</b> {opponent && opponent.health}
      </p>
    </>
  )
}
