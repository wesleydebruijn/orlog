import { v4 as uuidv4 } from 'uuid'

export const AUTH_LOGIN = 'AUTH_LOGIN'

type LoginAction = {
  type: typeof AUTH_LOGIN
}

export type Action = LoginAction

export type User = {
  id: string
  name: string
}

export type AuthState = {
  user?: User
}

export default function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'AUTH_LOGIN': {
      let userId = localStorage.getItem('orlog:userid')
      if (userId === null) {
        userId = uuidv4()
        localStorage.setItem('orlog:userid', userId)
      }

      return {
        ...state,
        user: {
          id: userId,
          name: 'Anonymous' // Maybe a random viking name!
        }
      }
    }
  }
}
