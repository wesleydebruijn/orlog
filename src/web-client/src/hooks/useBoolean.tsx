import { useEffect, useState } from 'react'

export function useBoolean(milliseconds: number): [boolean, (bool: boolean) => void] {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active) {
      const timeout = setTimeout(() => setActive(false), milliseconds)
      return () => clearTimeout(timeout)
    }
  }, [active])

  return [active, setActive]
}
