import { useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { useGame } from '../../../../../hooks/useGame'
import { usePlayer } from '../../../../../hooks/usePlayer'

import './GameInfo.scss'

export default function GameInfo() {
  const { phase, round } = useGame()
  const { current } = usePlayer()
  const [transitionPhase, setTransitionPhase] = useState(false)

  const props = useSpring({
    to: { opacity: transitionPhase ? 1 : 0 },
    from: { opacity: 0 },
    config: { duration: 700 },
    onRest: () => setTransitionPhase(false)
  })

  useEffect(() => setTransitionPhase(true), [phase.id])

  return (
    <>
      <animated.div style={props} className="game-overlay">
        {phase.name} phase
      </animated.div>
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
    </>
  )
}
