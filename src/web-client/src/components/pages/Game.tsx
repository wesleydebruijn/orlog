import { useEffect } from 'react'
import { useParams } from 'react-router';

import { useGame } from '../../hooks/useGame'

export default function Game() {
  const { joinGame } = useGame();
  const { id: gameId } = useParams<{ id: string }>();

   useEffect(() => {
    joinGame(gameId)
  }, []) 
  
  return (
    <h2>Gimma</h2>
  )
}