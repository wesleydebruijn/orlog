import React, { useEffect } from 'react'
import { useParams } from 'react-router';

import { useGame } from '../../hooks/useGame'

export default function Game() {
  const { joinGame, state: { player } } = useGame();
  const { id: gameId } = useParams<{ id: string }>();

  useEffect(() => {
    // @ts-ignore
    joinGame(gameId, player.id);
  }, []) 
  
  return (
    <h2>Gimma</h2>
  )
}