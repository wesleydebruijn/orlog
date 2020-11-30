defmodule Game.Phase.Resolution do
  @moduledoc """
  Player's dices face off against each other
  and previously selected God Favors are triggered before
  and/or after the standoff
  """
  @behaviour Game.Phase

  alias Game.{
    Player,
    Phase,
    Turn,
    Action
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, :start_phase) do
    %{turns: turns} = Phase.current(game)

    game
    |> IndexMap.update_all(:players, &Player.update(&1, %{turns: turns}))
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
    # todo: invoke pre resolution god favors (maybe in two fases? opponnent effects vs player effects)
    game
    |> Action.collect_tokens()
    |> Turn.update_player(&Player.update_turns(&1, -1))
    |> Turn.next()
  end

  def action(game, :resolution) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.resolve(Turn.get_opponent(game))
      |> Player.update_turns(-1)
    end)
    |> Turn.next()
  end

  def action(game, :post_resolution) do
    game
    |> Action.attack_health()
    |> Action.steal_tokens()
    |> Turn.update_player(fn player ->
      # todo: reset dice amount to game.settings.dices
      player
      |> Player.update_turns(-1)
    end)
    # todo: invoke post resolution god favors
    |> Turn.next()
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
