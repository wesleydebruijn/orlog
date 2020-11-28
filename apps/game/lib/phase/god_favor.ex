defmodule Game.Phase.GodFavor do
  @moduledoc """
  GodFavor phase
  """
  alias Game.Phase

  @behaviour Phase

  @impl Phase
  def start(game), do: game

  @impl Phase
  def execute(game, _action), do: game

  @impl Phase
  def finish(game), do: game
end
