import { useGame } from '../../../../../hooks/useGame'
import { usePlayer } from '../../../../../hooks/usePlayer'

import './GameInfo.scss'

export default function GameInfo() {
  const { phase, round } = useGame()
  const { current } = usePlayer()

  return (
    <section className="game-info">
      <div className="game-info__phase">{phase.name} phase</div>
      <div className="game-info__info">
        <span className="game-info__info__turn">
          turns {phase.turns - phase.auto_turns - current.turns + 1}/
          {phase.turns - phase.auto_turns}
        </span>
        <span className="game-info__info__round">round {round}</span>
      </div>
    </section>
  )
}
