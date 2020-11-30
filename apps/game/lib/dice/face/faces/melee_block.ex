defmodule Game.Dice.Face.MeleeBlock do
  @moduledoc """
  Dice face to block melee attack from the oponnent
  """
  @behaviour Game.Dice.Face

  @impl Game.Dice.Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Game.Dice.Face{
      type: :melee,
      stance: :block
    }
  end
end
