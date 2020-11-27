defmodule Game.Dice.Face.MeleeBlock do
  @moduledoc """
  Dice face to block melee attack from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  def perform, do: :ok
end
