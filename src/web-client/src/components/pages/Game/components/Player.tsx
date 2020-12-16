import React, { useState } from 'react'
import classNames from 'classnames'

import { GodFavorIcon, HealthIcon } from '../../../shared/Icons'

export function Player({ className }: { className?: string }) {
  const classes = classNames('flex items-center relative font-signika h-36', className)
  return (
    <div className={classes}>
      <img
        className="rounded-full z-10 border-4 border-secondary"
        src="https://avatarfiles.alphacoders.com/252/thumb-1920-252736.jpg"
        width="135"
        height="135"
      />
      <div className="border-secondary border-4 rounded bg-primary -ml-5 px-10 py-3">
        <h2 className="text-orange">Wesleydegroteeindbaas</h2>
        <span className="text-gray text-sm">King's Advisor</span>
      </div>
      <div className="absolute top-1/2 -left-7 z-20 bg-red-600 px-2 rounded flex justify-between text-white h-6">
        <HealthIcon className="text-white w-3 mr-2" />
        <span>15</span>
      </div>
      <div className="absolute top-2/3 mt-2 -left-3 z-20 bg-orange px-2 rounded flex justify-between text-white h-6">
        <GodFavorIcon className="text-white w-3 mr-2" />
        <span>10</span>
      </div>
    </div>
  )
}
