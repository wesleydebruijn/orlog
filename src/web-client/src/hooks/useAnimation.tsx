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

      const timeout = setTimeout(() => setAnimation(false), duration)

      return () => clearTimeout(timeout)
    }
  }, [active])

  return animation
}
