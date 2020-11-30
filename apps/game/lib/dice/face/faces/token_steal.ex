defmodule Game.Dice.Face.TokenSteal do
  @moduledoc """
  Dice face to steal token from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  @spec get :: Face.t()
  def get do
    %Face{
      type: :token,
      stance: :steal
    }
  end
end
