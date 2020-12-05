import React from 'react'

import { Favor as FavorProps } from '../../../../../../types/types'
import Favor from '../Favor'

import './FavorArea.scss'

type Props = {
  favors: FavorProps[]
  onFavorSelect?: (favorIndex: number, tier: number) => void
}

export default function FavorArea({ favors, onFavorSelect = undefined }: Props) {
  return (
    <section className="favor-area">
      {favors.map(({ name, tiers }, index) => (
        <Favor name={name} index={index + 1} key={name} onSelect={onFavorSelect} tiers={tiers} />
      ))}
    </section>
  )
}
