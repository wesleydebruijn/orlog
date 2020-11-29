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
    |> Game.current_player()
    |> Map.get(:turns)
    |> case do
      3 -> action(game, :pre_resolution)
      2 -> action(game, :resolution)
      1 -> action(game, :post_resolution)
      _other -> game
    end
  end

  def action(game, :pre_resolution) do
    player =
      game
      |> Game.current_player()
      |> Player.update_turns(-1)

    game
    |> Game.update_current_player(player)
    |> Turn.next()
  end

  def action(game, :resolution) do
    oponnent = Game.current_player(game)

    player =
      game
      |> Game.current_player()
      |> Player.update_turns(-1)
      |> Player.resolve(oponnent)

    game
    |> Game.update_current_player(player)
    |> Turn.next()
  end

  def action(game, :post_resolution) do
    player =
      game
      |> Game.current_player()
      |> Player.update_turns(-1)

    game
    |> Game.update_current_player(player)
    |> Turn.next()
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
