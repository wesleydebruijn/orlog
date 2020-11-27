defmodule Game.Dice do
  @moduledoc """
  Dice
  """
  @faces [
    Game.Dice.Face.MeleeAttack,
    Game.Dice.Face.MeleeBlock,
    Game.Dice.Face.RangeAttack,
    Game.Dice.Face.RangeBlock,
    Game.Dice.Face.StealToken
  ]

  @type t :: %Game.Dice{
    face: Game.Dice.Face.t(),
    tokens: integer(),
    keep: boolean()
  }
  defstruct face: nil, tokens: 0, keep: false

  @spec roll(Game.Dice.t()) :: Game.Dice.t()
  def roll(dice \\ %Game.Dice{}) do
    %Game.Dice{dice | face: Enum.random(@faces), tokens: Enum.random(0..1)}
  end

  @spec swap(Game.Dice.t()) :: Game.Dice.t()
  def swap(dice) do
    %Game.Dice{dice | keep: !dice.keep}
  end
end
