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
    Turn
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
    player = Turn.get_player(game)
    %{tier: tier} = Player.get_favor(player, favor_tier)

    if Player.sufficient_tokens?(player, Map.get(tier, :cost)) do
      game
      |> Turn.update_player(&Player.update(&1, %{favor_tier: favor_tier}))
      |> Turn.next()
    else
      game
    end
  end

  def action(game, :end_turn) do
    Turn.update_player(game, &Player.increase(&1, :turns, -1))
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
