import { useGame } from '../../../../../hooks/useGame'
import { usePlayer } from '../../../../../hooks/usePlayer'
import { Phase, PhaseId, Player } from '../../../../../types/types'
import './ContinueButton.scss'

type Props = {
  onClick: () => void
}

function buttonText(phase: Phase, player: Player) {
  switch (phase.id) {
    case PhaseId.Roll:
      const rollable =
        !player.rolled && Object.values(player.dices).filter(dice => !dice.locked).length > 0

      return rollable ? 'Roll dices' : 'End turn'
    case PhaseId.GodFavor:
      return 'End turn'
    case PhaseId.Resolution:
      return 'Next round'
  }
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
