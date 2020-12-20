import { useContext } from 'react'

import { DataContext } from '../providers/DataProvider'

export function useData() {
  const { favors } = useContext(DataContext)

  return { favors }
}
