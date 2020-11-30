defmodule Game.Dice.Face.MeleeAttack do
  @moduledoc """
  Dice face to deal melee attack to the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  @spec get :: Face.t()
  def get do
    %Face{
      type: :melee,
      stance: :attack
    }
  end
end
