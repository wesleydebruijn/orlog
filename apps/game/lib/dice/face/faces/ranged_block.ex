defmodule Game.Dice.Face.RangedBlock do
  @moduledoc """
  Dice face to block ranged attack from the oponnent
  """
  @behaviour Game.Dice.Face

  @impl Game.Dice.Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Game.Dice.Face{
      type: :ranged,
      stance: :block
    }
  end
end
