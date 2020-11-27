defmodule Game.Dice.Face.RangeBlock do
  @moduledoc """
  Dice face to block range attack from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  def perform, do: :ok
end
