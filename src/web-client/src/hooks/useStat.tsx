import { useEffect, useState } from 'react'
import { useBoolean } from './useBoolean'

export function useStat(initAmount: number, timeout: number) {
  const [amount, setAmount] = useState(initAmount)
  const [diff, setDiff] = useState(0)
  const [change, setChange] = useBoolean(timeout)

  useEffect(() => {
    const diff = initAmount - amount
    if (diff === 0) return

    setDiff(diff)
    setChange(true)
    setAmount(initAmount)
  }, [initAmount])

  return {
    amount,
    diff,
    change
  }
}
