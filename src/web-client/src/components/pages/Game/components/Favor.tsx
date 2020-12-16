import React, { useState } from 'react'
import classNames from 'classnames'

import { GodFavorIcon } from '../../../shared/Icons'

export function Favors({ className }: { className?: string }) {
  const [openFavor, setOpenFavor] = useState(0)
  const classes = classNames('relative flex-initial w-80 h-20 font-signika', className)

  function toggleFavor(index: number) {
    if (openFavor === index) {
      setOpenFavor(0)
    } else {
      setOpenFavor(index)
    }
  }

  return (
    <div className={classes}>
      <Favor
        index={1}
        active={1 === openFavor}
        title="Thor's Strike"
        description="Deal direct damage to your opponent"
        toggleTiers={toggleFavor}
      />
      <Favor
        index={2}
        active={2 === openFavor}
        title="Brunhild's Fury"
        description="Multiply your melee attack dice"
        toggleTiers={toggleFavor}
      />
      <Favor
        index={3}
        active={3 === openFavor}
        title="Baldr's Invurnerability"
        description="Double each melee and ranged block dice"
        toggleTiers={toggleFavor}
      />
    </div>
  )
}

export function Favor({
  className,
  title,
  description,
  tiers,
  toggleTiers,
  index,
  active = false
}: {
  index: number
  className?: string
  title: string
  description: string
  active?: boolean
  toggleTiers: (index: number) => void
  tiers?: {
    text: string
    cost: number
  }[]
}) {
  const classes = classNames(
    'bg-primary px-6 py-2 border-4 rounded border-secondary flex cursor-pointer mb-1',
    className
  )
  return (
    <>
      <div className={classes} onClick={() => toggleTiers(index)}>
        <div className="flex flex-col">
          <h2 className="text-orange font-bold text-sm">{title}</h2>
          <span className="text-gray text-xs">{description}</span>
        </div>
      </div>
      {active && (
        <div className="flex flex-col justify-center -mt-1">
          <div className="bg-white border-t-2 border-b-2 border-lightGray mx-1">
            <div className="flex justify-between items-center py-2 px-3">
              <span className="text-gray">Deal 2 damage</span>
              <span className="min-w-f-50 rounded border-2 border-orange px-1 text-gray flex items-center">
                <GodFavorIcon className="text-orange w-3 mr-2" />
                10
              </span>
              <span className="rounded border-2 bg-orange text-white px-2 py-1 text-sm">
                Activate
              </span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 border-b-1 border-lightGray">
              <span className="text-gray">Deal 4 damage</span>
              <span className="min-w-f-50 rounded border-2 border-orange px-1 text-gray flex items-center">
                <GodFavorIcon className="text-orange w-3 mr-2" />5
              </span>
              <span className="rounded border-2 bg-orange text-white px-2 py-1 text-sm">
                Activate
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
