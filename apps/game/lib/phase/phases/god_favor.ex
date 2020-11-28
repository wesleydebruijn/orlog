defmodule Game.Phase.GodFavor do
  @moduledoc """
  GodFavor phase
  """
  @behaviour Game.Phase

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, _other) do
    # unknown action
    game
  end
end
