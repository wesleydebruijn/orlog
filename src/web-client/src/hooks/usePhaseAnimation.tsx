import { useEffect } from 'react'
import { useSpring } from 'react-spring'

import { useBoolean } from './useBoolean'
import { Phase } from '../types/types'

export function usePhaseAnimation(phase: Phase) {
  const [transitioning, setTransitioning] = useBoolean(1000)
  const props = useSpring({
    to: { opacity: transitioning ? 1 : 0 },
    from: { opacity: 0 },
    config: { duration: 700 }
  })

  useEffect(() => setTransitioning(true), [phase.id])

  return props
}
