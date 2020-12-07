import React from 'react'

type Props = {
  won: boolean
}

export default function GameStateFinished({ won }: Props) {
  if (won) {
    return <h2>You won!</h2>
  } else {
    return <h2>You lost!</h2>
  }
}
