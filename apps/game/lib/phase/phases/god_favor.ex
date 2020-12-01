defmodule Game.Phase.GodFavor do
  @moduledoc """
  Players can request help from the Gods by
  spending their tokens for an extra perk during the
  next phase of the game
  """
  @behaviour Game.Phase

  alias Game.{
    Player,
    Phase,
    Turn,
    Favor
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, :start_phase) do
    %{turns: turns} = Phase.current(game)

    game
    |> IndexMap.update_all(:players, &Player.update(&1, %{turns: turns}))
  end

  def action(game, :continue), do: Turn.next(game)

  def action(game, {:select, favor_tier}) do
    game
    |> Favor.select(favor_tier)
    |> Turn.next()
  end

  def action(game, :end_turn) do
    Turn.update_player(game, &Player.increase(&1, :turns, -1))
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
