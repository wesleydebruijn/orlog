defmodule Game.Dice.Face.MeleeAttack do
  @moduledoc """
  Dice face to deal melee attack to the oponnent
  """
  @behaviour Game.Dice.Face

  @impl Game.Dice.Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Game.Dice.Face{
      type: :melee,
      stance: :attack
    }
  end
end
