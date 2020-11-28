defmodule Game.Phase do
  @moduledoc """
  Behaviour of a phase
  """
  @callback action(Game.t(), any()) :: Game.t()
end
