import React from 'react'
import { animated, useTrail } from 'react-spring'
import { FavorTier as FavorTierProps } from '../../../../../types/types'

import './Favor.scss'
import FavorTier from './FavorTier/FavorTier'

type Props = {
  index: number
  name: string
  open: boolean
  tiers: {
    [index: number]: FavorTierProps
  }
  onSelect?: (favor: number, tier: number) => void
  onClick: (tier: number) => void
}

export default function Favor({ index, open, name, tiers, onSelect, onClick }: Props) {
  const tiersArray = Object.entries(tiers)
  const trail = useTrail(tiersArray.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    height: open ? 30 : 0,
    from: { opacity: 0, height: 0 }
  })

  return (
    <div className="favor">
      <div className="favor__title">{name}</div>
      <div className="favor__description">Deal damage to your opponent</div>
      {onSelect && (
        <button className="favor__toggle" onClick={() => onClick(!open ? index : 0)}>
          {open ? 'Close' : 'Open'}
        </button>
      )}
      {trail.map(({ ...props }, index) => (
        <animated.div key={tiersArray[index][0]} style={{ ...props }}>
          <FavorTier
            favorIndex={index}
            tierIndex={parseInt(tiersArray[index][0])}
            tier={tiersArray[index][1]}
            onSelect={onSelect}
          />
        </animated.div>
      ))}
    </div>
  )
}
