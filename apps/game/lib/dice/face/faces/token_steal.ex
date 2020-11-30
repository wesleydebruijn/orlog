defmodule Game.Dice.Face.TokenSteal do
  @moduledoc """
  Dice face to steal token from the oponnent
  """
  @behaviour Game.Dice.Face

  @impl Game.Dice.Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Game.Dice.Face{
      type: :token,
      stance: :steal
    }
  end
end
