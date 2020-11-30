defmodule Game.Phase.GodFavor do
  @moduledoc """
  GodFavor phase
  """
  @behaviour Game.Phase

  alias Game.{
    Player,
    Phase,
    Turn
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, :start_phase) do
    %{turns: turns} = Phase.current(game)

    game
    |> Game.update_players(&Player.update(&1, %{turns: turns}))
  end

  def action(game, :continue), do: Turn.next(game)

  def action(game, :end_turn) do
    Turn.update_player(game, &Player.update_turns(&1, -1))
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
