defmodule Game.Dice.Face.RangedAttack do
  @moduledoc """
  Dice face to deal ranged attack to the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  @spec get :: Face.t()
  def get do
    %Face{
      type: :ranged,
      stance: :attack
    }
  end
end
