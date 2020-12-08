import { useEffect, useState } from 'react'

export function useAnimation(active: boolean, duration: number): boolean {
  const [activated, setActivated] = useState(false)
  const [animation, setAnimation] = useState(false)

  useEffect(() => {
    if (!active) {
      setActivated(false)
      setAnimation(false)
    } else if (!activated) {
      setAnimation(true)

      setTimeout(() => setAnimation(false), duration)
    }
  }, [active])

  return animation
}
