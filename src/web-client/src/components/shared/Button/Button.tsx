import React from 'react'

type Props = {
  children: React.ReactNode
  onClick: () => void
}

export default function Button({ onClick, children }: Props) {
  return (
    <button
      onClick={() => onClick()}
      className="min-w-f-120 bg-orange text-black rounded px-6 py-2 text-xs"
    >
      {children}
    </button>
  )
}
