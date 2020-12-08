import { useEffect, useState } from 'react'

export function useAnimation(duration: number) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active) {
      const timeout = setTimeout(() => setActive(false), duration)
      return () => clearTimeout(timeout)
    }
  }, [active])

  return {
    setActive,
    active
  }
}
