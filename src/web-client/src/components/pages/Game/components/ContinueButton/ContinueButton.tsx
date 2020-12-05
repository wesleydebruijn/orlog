import React, { ButtonHTMLAttributes } from 'react'

import './ContinueButton.scss'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onClick'> & {
  text: string
  onClick: () => void
}

export default function ContinueButton({ text, onClick, ...rest }: Props) {
  return (
    <button className="continue-button" onClick={() => onClick()} {...rest}>
      {text}
    </button>
  )
}
