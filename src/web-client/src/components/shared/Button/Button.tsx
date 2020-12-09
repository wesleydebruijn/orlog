import React from 'react'

import './Button.scss'

type Props = {
  children: React.ReactNode
  onClick: () => void
}

export default function Button({ onClick, children }: Props) {
  return (
    <button onClick={() => onClick()} className="button">
      {children}
    </button>
  )
}
