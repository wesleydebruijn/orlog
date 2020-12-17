import classNames from 'classnames'
import React from 'react'

import './FancyButton.scss'

type Props = {
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export default function FancyButton({ onClick, children, className }: Props) {
  const classes = classNames('button button--fancy', className)
  return (
    <button className={classes} onClick={() => onClick()}>
      {children}
    </button>
  )
}
