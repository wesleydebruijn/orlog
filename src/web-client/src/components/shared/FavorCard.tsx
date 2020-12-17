import classNames from 'classnames'
import React from 'react'

import GodFavorIcon from './Icons/GodFavorIcon'

export function FavorCard({
  className,
  name,
  description,
  open,
  index,
  active = false,
  children
}: {
  index: number
  className?: string
  name: string
  description: string
  children: React.ReactNode
  active?: boolean
  open: (index: number) => void
}) {
  const classes = classNames(
    'bg-primary px-6 py-2 border-4 rounded border-secondary flex cursor-pointer mb-1',
    className
  )
  return (
    <>
      <div className={classes} onClick={() => open(index)}>
        <div className="flex flex-col">
          <h2 className="text-orange font-bold text-sm">{name}</h2>
          <span className="text-gray text-xs">{description}</span>
        </div>
      </div>
      {active && (
        <div className="flex flex-col justify-center -mt-1">
          <div className="bg-white border-t-2 border-b-2 border-lightGray mx-1">{children}</div>
        </div>
      )}
    </>
  )
}

export function Tier({
  description,
  value,
  cost,
  onClick
}: {
  description: string
  value: number
  cost: number
  onClick: () => void
}) {
  return (
    <div className="flex justify-between items-center py-2 px-3">
      <span className="text-gray text-sm">{description.replace(/{value}/, `${value}`)}</span>
      <span className="min-w-f-50 rounded border-2 border-orange px-1 text-gray flex items-center">
        <GodFavorIcon className="text-orange w-3 mr-2" />
        {cost}
      </span>
      <span
        onClick={() => onClick}
        className="rounded border-2 bg-orange text-white px-2 py-1 text-sm cursor-pointer"
      >
        Activate
      </span>
    </div>
  )
}
