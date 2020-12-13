import React, { useState } from 'react'
import { usePlayer } from '../../../../../../hooks/usePlayer'

import Favor from '../Favor'

import './FavorArea.scss'

type Props = {
  onFavorSelect?: (favorIndex: number, tier: number) => void
}

export default function FavorArea({ onFavorSelect = undefined }: Props) {
  const { favors } = usePlayer()
  const [openFavor, setOpenFavor] = useState(0)

  return (
    <section className="favor-area">
      {favors.map(({ name, tiers }, index) => (
        <Favor
          name={name}
          open={index + 1 === openFavor}
          index={index + 1}
          key={name}
          onSelect={onFavorSelect}
          onClick={setOpenFavor}
          tiers={tiers}
        />
      ))}
    </section>
  )
}
