import React from 'react'
import { usePlayer } from '../../../../../../hooks/usePlayer'

import Favor from '../Favor'

import './FavorArea.scss'

type Props = {
  onFavorSelect?: (favorIndex: number, tier: number) => void
}

export default function FavorArea({ onFavorSelect = undefined }: Props) {
  const { favors } = usePlayer()

  return (
    <section className="favor-area">
      {favors.map(({ name, tiers }, index) => (
        <Favor name={name} index={index + 1} key={name} onSelect={onFavorSelect} tiers={tiers} />
      ))}
    </section>
  )
}
