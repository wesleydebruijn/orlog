import React from 'react'
import { keyframes } from 'styled-components'
import styled from 'styled-components'

import './ContinueButton.scss'

type Props = {
  text: string
  seconds: number
  remainingSeconds: number
  onClick: () => void
}

export default function ContinueButton({
  text,
  seconds,
  remainingSeconds,
  onClick,
  ...rest
}: Props) {
  const loading = keyframes`
    0% { background-position: bottom left; }
    100% { background-position: bottom right; }
  `

  const AnimatedButton = styled.button`
    animation: ${loading} ${remainingSeconds}s linear 1;
    animation-delay: -${seconds - remainingSeconds}s;
  `

  return (
    <div className="continue-button-container">
      <AnimatedButton onClick={() => onClick()} {...rest}>
        {text}
      </AnimatedButton>
    </div>
  )
}
