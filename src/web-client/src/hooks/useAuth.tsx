import { useContext } from 'react'

import { Context } from '../providers/AuthProvider'

export function useAuth() {
  const { dispatch, state } = useContext(Context)

  return {
    login: () => {
      dispatch({ type: 'AUTH_LOGIN' })
    },
    state
  }
}

export function useUser() {
  const {
    state: { user }
  } = useContext(Context)

  if (user === undefined) {
    throw new Error('Trying to access undefined user; this is most likely a programmer error.')
  }

  return user
}
