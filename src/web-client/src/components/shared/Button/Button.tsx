import classNames from 'classnames'
import React from 'react'

import './Button.scss'

type Props = {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick: () => void
}

export default function Button({ onClick, children, variant = 'primary' }: Props) {
  const classes = classNames('button', {
    'button--primary': variant === 'primary',
    'button--secondary': variant === 'secondary'
  })
  return (
    <button onClick={() => onClick()} className={classes}>
      {children}
    </button>
  )
}
