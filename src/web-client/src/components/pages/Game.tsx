import React, { useEffect } from 'react'
import { useParams } from 'react-router';

import { useWebsocket } from '../../hooks/useWebsocket'

export default function Game() {
  const { joinGame, state: { user } } = useWebsocket();
  const { gameId} = useParams<{ gameId: string }>();
  useEffect(() => {
    // @ts-ignore
    joinGame(gameId, user.id);
  }, []) 
  
  return (
    <h2>Gimma</h2>
  )
}