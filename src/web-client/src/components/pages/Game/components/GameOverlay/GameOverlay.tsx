import { animated, useSpring } from 'react-spring'

import './GameOverlay.scss'

type Props = {
  active: boolean
  children: React.ReactNode
}

export function GameOverlay({ active, children }: Props) {
  const props = useSpring({
    to: { opacity: active ? 1 : 0 },
    from: { opacity: 0 },
    config: { duration: 700 }
  })

  return (
    <animated.div style={props} className="game-overlay">
      {children}
    </animated.div>
  )
}
