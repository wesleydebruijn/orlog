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
    Action,
    Favor
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, :start_phase) do
    %{turns: turns} = Phase.current(game)

    game
    |> IndexMap.update_all(:players, &Player.update(&1, %{turns: turns}))
    |> Action.Token.collect_tokens()
    |> Turn.opponent(&Action.Token.collect_tokens/1)
  end

  def action(game, :start_turn), do: Turn.next(game)

  def action(game, :end_turn) do
    game
    |> Turn.get_player()
    |> case do
      %{turns: 7} -> action(game, {:pre_resolution, :opponent})
      %{turns: 6} -> action(game, {:pre_resolution, :player})
      %{turns: 5} -> action(game, {:resolution, :resolve})
      %{turns: 4} -> action(game, {:resolution, :attack})
      %{turns: 3} -> action(game, {:resolution, :steal})
      %{turns: 2} -> action(game, {:post_resolution, :opponent})
      %{turns: 1} -> action(game, {:post_resolution, :player})
      _other -> game
    end
    |> Turn.update_player(&Player.increase(&1, :turns, -1))
  end

  def action(game, {:pre_resolution, affects}) do
    game
    |> Favor.invoke(:pre_resolution, affects)
  end

  def action(game, {:resolution, :resolve}) do
    game
    |> Turn.update_player(&Player.resolve(&1, Turn.get_opponent(game)))
  end

  def action(game, {:resolution, :attack}) do
    game
    |> Action.Attack.attack_health()
  end

  def action(game, {:resolution, :steal}) do
    game
    |> Action.Token.steal_tokens()
  end

  def action(game, {:post_resolution, :opponent}) do
    game
    |> Favor.invoke(:post_resolution, :opponent)
  end

  def action(game, {:post_resolution, :player}) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.update(%{dices: IndexMap.take(player.dices, game.settings.dices)})
    end)
    |> Favor.invoke(:post_resolution, :player)
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
