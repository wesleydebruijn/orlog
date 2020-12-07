import React from 'react'
import { AsyncState } from 'react-async'

type Props<T> = {
  state: AsyncState<T>
  children: (data: T) => React.ReactNode
}

export default function AsyncContent<T>({ children, state }: Props<T>) {
  switch (state.status) {
    case 'pending':
      return null

    case 'fulfilled':
      return <>{children(state.data)}</>

    case 'rejected':
      // @TODO: Perhaps show a skeleton structure
      // of the element we're trying to fetch data for.
      return null

    default:
      // @TODO: Probably better handle edge cases
      return null
  }
}
