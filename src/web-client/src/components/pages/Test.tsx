import { Dice } from '../../types/types'
import DiceGrid from './Game/components/Dice/DiceGrid/DiceGrid'

export default function Test() {
  function createDice(stance: any, type: any): Dice {
    return {
      face: {
        stance: stance,
        type: type,
        disabled: false,
        count: 1,
        amount: 1,
        intersects: 1
      },
      tokens: 1,
      locked: false,
      keep: false
    }
  }

  const dices: {
    [index: number]: Dice
  } = {
    1: createDice('attack', 'ranged'),
    2: createDice('attack', 'melee'),
    3: createDice('block', 'ranged'),
    4: createDice('block', 'melee'),
    5: createDice('steal', 'token'),
    6: createDice('attack', 'ranged')
  }
  const onToggle = () => {
    console.log('je moeder')
  }

  return (
    <>
      <button onClick={onToggle}>Toggle</button>
      <DiceGrid dices={dices} onToggleDice={onToggle} rolling={true} />
    </>
  )
}
