defmodule Game.Dice.Face.RangedAttack do
  @moduledoc """
  Dice face to deal ranged attack to the oponnent
  """
  @behaviour Game.Dice.Face

  @impl Game.Dice.Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Game.Dice.Face{
      type: :ranged,
      stance: :attack
    }
  end
end
