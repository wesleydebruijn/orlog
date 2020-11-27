defmodule Game.Dice.Face.RangeAttack do
  @moduledoc """
  Dice face to deal range attack to the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  def perform, do: :ok
end
