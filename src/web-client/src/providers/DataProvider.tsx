import React, { useEffect, useState } from 'react'
import { Favor } from '../types/types'

type State = {
  favors: Favor[]
}

export const DataContext = React.createContext<State>({
  favors: []
})

export default function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<State>({ favors: [] })

  useEffect(() => {
    async function fetchFavors() {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/favors`)
      const data = await response.json()

      setData(prev => ({
        ...prev,
        favors: data
      }))
    }

    fetchFavors()
  }, [])
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}
