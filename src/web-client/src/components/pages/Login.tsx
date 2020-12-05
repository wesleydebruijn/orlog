import { useEffect } from 'react'
import { useHistory } from 'react-router'

import { useAuth } from '../../hooks/useAuth'

/**
 * This component doesnt really login a user for now, but it assigns
 * a unique identifier as well as give a randomly generated username.
 */
export default function Login() {
  const {
    login,
    state: { user }
  } = useAuth()
  const history = useHistory<{ from: { pathname: string } }>()

  useEffect(() => {
    login()
  })

  useEffect(() => {
    if (user) {
      history.push(history.location.state ? history.location.state.from : '/')
    }
  }, [user, history])

  return null
}
