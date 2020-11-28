defmodule Game.Phase.Resolution do
  @moduledoc """
  Resolution phase
  """
  @behaviour Game.Phase

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, _other) do
    # unknown action
    game
  end
end
