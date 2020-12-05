import React from 'react'

import './Favor.scss'

type Props = {
  name: string
}

export default function Favor({ name }: Props) {
  return (
    <div className="favor">
      <span>{name}</span>
    </div>
  )
}
