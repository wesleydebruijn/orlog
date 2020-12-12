import { useGame } from '../../../../../hooks/useGame'
import { usePlayer } from '../../../../../hooks/usePlayer'
import { Phase, PhaseId, Player } from '../../../../../types/types'
import './ContinueButton.scss'

type Props = {
  onClick: () => void
}

function buttonText(phase: Phase, player: Player) {
  if (phase.id === PhaseId.Roll && !player.rolled) return 'Roll dices'
  if (phase.id === PhaseId.Resolution) return 'Next round'

  return 'End turn'
}

export default function ContinueButton({ onClick }: Props) {
  const { phase, hasTurn } = useGame()
  const { player } = usePlayer()

  if (!hasTurn) return <></>

  return (
    <button className="continue-button" onClick={() => onClick()}>
      {buttonText(phase, player)}
    </button>
  )
}
