import classNames from 'classnames'
import React from 'react'

import { HealthIcon, GodFavorIcon } from './Icons'

export function PlayerCard({
  className,
  name,
  title,
  health,
  tokens
}: {
  className?: string
  name: string
  title: string
  health: number
  tokens: number
}) {
  const classes = classNames('flex items-center relative font-signika h-36', className)
  return (
    <div className={classes}>
      <img
        alt=""
        className="rounded-full z-10 border-4 border-secondary"
        src="https://avatarfiles.alphacoders.com/252/thumb-1920-252736.jpg"
        width="135"
        height="135"
      />
      <div className="border-secondary border-4 rounded bg-primary -ml-5 w-64 px-10 py-3">
        <h2 className="text-orange">{name}</h2>
        <span className="text-gray text-sm">{title}</span>
      </div>
      <div className="absolute top-1/2 -left-7 z-20 bg-red-600 px-2 rounded flex justify-between text-white h-6">
        <HealthIcon className="text-white w-3 mr-2" />
        <span>{health}</span>
      </div>
      <div className="absolute top-2/3 mt-2 -left-3 z-20 bg-orange px-2 rounded flex justify-between text-white h-6">
        <GodFavorIcon className="text-white w-3 mr-2" />
        <span>{tokens}</span>
      </div>
    </div>
  )
}
