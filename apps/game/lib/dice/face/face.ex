defmodule Game.Dice.Face do
  @moduledoc """
  Behaviour of a dice face
  """
  @callback perform :: :ok
end
