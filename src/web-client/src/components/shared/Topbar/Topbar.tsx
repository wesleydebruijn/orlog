import React from 'react'
import './Topbar.scss'

type Props = {
  title: string
}

export default function Topbar({ title }: Props) {
  return (
    <section className="topbar">
      <div className="topbar__center">
        <span>{title}</span>
      </div>
    </section>
  )
}
