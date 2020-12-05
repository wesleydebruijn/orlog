import React from 'react'
import { FavorTier } from '../../../../../types/types'

import './Favor.scss'

type Props = {
  index: number
  name: string
  tiers: {
    [index: number]: FavorTier
  }
  onSelect?: (favor: number, tier: number) => void
}

export default function Favor({ index, name, tiers, onSelect }: Props) {
  return (
    <div className="favor">
      <span>{name}</span>
      {onSelect !== undefined &&
        Object.entries(tiers).map(([tierIndex, tier], no) => (
          <button key={no} onClick={() => onSelect(index, parseInt(tierIndex))}>
            {tierIndex} - {tier.value} for {tier.cost} tokens
          </button>
        ))}
    </div>
  )
}
