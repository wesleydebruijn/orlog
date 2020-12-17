import classNames from 'classnames'
import React from 'react'

import { useGame } from '../../../../hooks/useGame'
import { usePlayer } from '../../../../hooks/usePlayer'
import { Phase, Player, PhaseId } from '../../../../types/types'
import Diamond from '../../../shared/Figures/Diamond'

/**
 * Nie zo mooie button, maar komt goe
 *
 * @param param0
 */
export function ContinueButton({ onClick }: { onClick?: () => void }) {
  const { phase } = useGame()
  const { player } = usePlayer()

  const classes = classNames('relative flex justify-end', {
    'cursor-wait': onClick === undefined,
    'cursor-pointer': onClick !== undefined
  })

  return (
    <div className={classes} onClick={onClick}>
      <Diamond className="w-64 text-red-600 z-10">
        <span className="text-white z-10 text-large">
          {onClick !== undefined ? buttonText(phase, player) : 'Waiting for opponent...'}
        </span>
      </Diamond>
    </div>
  )
}

function buttonText(phase: Phase, player: Player) {
  switch (phase.id) {
    case PhaseId.Roll:
      const rollable =
        !player.rolled && Object.values(player.dices).filter(dice => !dice.locked).length > 0

      return rollable ? 'Roll dices' : 'End turn'
    case PhaseId.GodFavor:
      return 'End turn'
    case PhaseId.Resolution:
      return 'Next round'
  }
}
