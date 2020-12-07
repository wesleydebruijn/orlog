import React from 'react'
import { PromiseFn, useAsync } from 'react-async'
import AsyncContent from '../../shared/AsyncContent'

import './Player.scss'

export default function Player() {
  const state = useAsync<PlayerType>(fetchPlayer)

  return (
    <AsyncContent state={state}>
      {({ avatar, name, level, title }) => (
        <section className="player">
          <div className="player__avatar">
            <img src={avatar} alt="" />
          </div>
          <div className="player__info">
            <span className="player__info__name">{name}</span>
            <span className="player__info__title">{title}</span>
          </div>
        </section>
      )}
    </AsyncContent>
  )
}

type PlayerType = {
  name: string
  level: number
  avatar: string
  title: string
}
const fetchPlayer: PromiseFn<PlayerType> = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/player`)
  if (!response.ok) throw new Error(response.statusText)
  return response.json()
}
