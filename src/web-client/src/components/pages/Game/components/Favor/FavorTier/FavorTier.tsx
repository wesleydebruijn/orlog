import React from 'react'
import { FavorTier as FavorTierProps } from '../../../../../../types/types'

import './FavorTier.scss'

type Props = {
  favorIndex: number
  tierIndex: number
  tier: FavorTierProps
  onSelect?: (favor: number, tier: number) => void
}

export default function FavorTier({ tier, tierIndex, favorIndex, onSelect }: Props) {
  if (!onSelect) return null

  return (
    <div className="favor-tier">
      {tierIndex} - {tier.value} for {tier.cost} tokens
      <button onClick={() => onSelect(favorIndex, tierIndex)}>activate</button>
    </div>
  )
}
