defmodule Game.Dice.Face.StealToken do
  @moduledoc """
  Dice face to steal token from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  @spec get :: Game.Dice.Face.t()
  def get do
    %Face{
      type: :token,
      stance: :steal
    }
  end
end
