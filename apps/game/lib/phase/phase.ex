defmodule Game.Phase do
  @moduledoc """
  Behaviour of a phase
  """
  @callback start(Game.t()) :: Game.t()
  @callback execute(Game.t(), any()) :: Game.t()
  @callback finish(Game.t()) :: Game.t()
end
