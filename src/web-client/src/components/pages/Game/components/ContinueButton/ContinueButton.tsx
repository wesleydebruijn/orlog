import React, { ButtonHTMLAttributes } from 'react'
import { keyframes } from 'styled-components'
import styled from 'styled-components'

import './ContinueButton.scss'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onClick'> & {
  text: string
  seconds: number
  onClick: () => void
}

export default function ContinueButton({ text, seconds, onClick, ...rest }: Props) {
  const loading = keyframes`
    0% { background-position: bottom left; }
    100% { background-position: bottom right; }
  `

  const AnimatedButton = styled.button`
    animation: ${loading} ${seconds}s linear 1;
    animation-delay: -${30 - seconds}s;
  `

  return (
    <div className="continue-button-container">
      <AnimatedButton onClick={() => onClick()} {...rest}>
        {text}
      </AnimatedButton>
    </div>
  )
}
