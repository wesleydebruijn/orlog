
import { useGameLobby } from '../../hooks/useGameLobby';
import { getOpponentPlayer,getPlayer, getPhase, getRound } from '../../selectors';

export default function Game() {
  const { state } = useGameLobby();

  const round = getRound(state)
  const phase = getPhase(state)

  const player = getPlayer(state)
  const opponent = getOpponentPlayer(state)

  return (
    <>
      <h2>Game: {state.uuid}</h2>
      <p>
        <b>Round:</b> {round}<br />
        <b>Phase:</b> {phase}
      </p>
      <p>
        <b>You are:</b> {player && player.uuid}
      </p>
      <p>
        <b>Your opponent is:</b> {opponent && opponent.uuid}
      </p>
    </>
  )
}
