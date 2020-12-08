import React from 'react'

import './ContentBox.scss'

type Props = {
  title: string
  children: React.ReactNode
}

export default function ContentBox({ title, children }: Props) {
  return (
    <div className="content-box">
      <div className="content-box__title">
        <h2>{title}</h2>
      </div>
      <div className="content-box__content">{children}</div>
    </div>
  )
}
