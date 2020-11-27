defmodule Game.Dice.Face.StealToken do
  @moduledoc """
  Dice face to steal token from the oponnent
  """
  alias Game.Dice.Face

  @behaviour Face

  @impl Face
  def perform, do: :ok
end
