defmodule Game.Dice.Face do
  @moduledoc """
  Behaviour of a dice face

  when not {disabled} do {stance} for {count} times with {amount}
  and gain extra {health} and {tokens} for every successful {stance}
  """
  @callback get :: Game.Dice.Face.t()

  @type t :: %Game.Dice.Face{
    count: integer(),
    amount: integer(),
    health: integer(),
    tokens: integer(),
    disabled: boolean(),
    type: :melee | :ranged | :token,
    stance: :attack | :block | :steal
  }
  defstruct count: 1, amount: 1, health: 0, tokens: 0, disabled: false, type: :melee, stance: :block
end
