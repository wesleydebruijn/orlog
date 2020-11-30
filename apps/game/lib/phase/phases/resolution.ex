defmodule Game.Phase.Resolution do
  @moduledoc """
  Resolution phase
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
    |> Game.update_players(fn player ->
      player
      |> Player.update(%{turns: turns})
      |> Player.collect_tokens()
    end)
  end

  def action(game, :start_turn), do: Turn.next(game)

  def action(game, :end_turn) do
    game
    |> Turn.get_player()
    |> case do
      %{turns: 3} -> action(game, :pre_resolution)
      %{turns: 2} -> action(game, :resolution)
      %{turns: 1} -> action(game, :post_resolution)
      _other -> game
    end
  end

  def action(game, :pre_resolution) do
    game
    |> Turn.update_player(&Player.update_turns(&1, -1))
    |> Turn.next()
  end

  def action(game, :resolution) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.update_turns(-1)
      |> Player.resolve(Turn.get_opponent(game))
    end)
    |> Turn.next()
  end

  def action(game, :post_resolution) do
    game
    |> Turn.update_player(&Player.update_turns(&1, -1))
    |> Turn.next()
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
