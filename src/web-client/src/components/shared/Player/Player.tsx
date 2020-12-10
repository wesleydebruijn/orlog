import React from 'react'
import { PromiseFn, useAsync } from 'react-async'
import AsyncContent from '../../shared/AsyncContent'

export default function Player() {
  const state = useAsync<PlayerType>(fetchPlayer)

  return (
    <AsyncContent state={state}>
      {({ avatar, name, level, title }) => (
        <section className="flex justify-between font-signika">
          <img
            src={avatar}
            alt=""
            className="rounded-full mr-6 border-4 border-green-200 top-12 relative"
            width="140"
            height="140"
          />
          <div className="flex flex-col justify-center">
            <span className="text-orange text-xl">{name}</span>
            <span className="text-gray text-xs">{title}</span>
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
