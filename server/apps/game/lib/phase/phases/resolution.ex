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
      %{turns: 5} -> action(game, :pre_resolution)
      %{turns: 4} -> action(game, :resolve)
      %{turns: 3} -> action(game, :attack)
      %{turns: 2} -> action(game, :steal)
      %{turns: 1} -> action(game, :post_resolution)
      _other -> game
    end
    |> Turn.update_player(&Player.increase(&1, :turns, -1))
  end

  def action(game, :pre_resolution) do
    # todo: invoke pre resolution god favors (maybe in two fases? opponnent effects vs player effects)
    game
    |> Action.collect_tokens()
  end

  def action(game, :resolve) do
    game
    |> Turn.update_player(&Player.resolve(&1, Turn.get_opponent(game)))
  end

  def action(game, :attack) do
    game
    |> Action.attack_health()
  end

  def action(game, :steal) do
    game
    |> Action.steal_tokens()
  end

  def action(game, :post_resolution) do
    # todo: reset dice amount to game.settings.dices
    # todo: invoke post resolution god favors
    game
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
