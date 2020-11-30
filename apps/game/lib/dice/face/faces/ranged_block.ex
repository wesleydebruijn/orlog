defmodule Game.Dice.Face.RangedBlock do
  @moduledoc """
  Dice face to block ranged attack from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  @spec get :: Face.t()
  def get do
    %Face{
      type: :ranged,
      stance: :block
    }
  end
end
