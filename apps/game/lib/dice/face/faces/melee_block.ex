defmodule Game.Dice.Face.MeleeBlock do
  @moduledoc """
  Dice face to block melee attack from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Face{
      type: :melee,
      stance: :block
    }
  end
end
