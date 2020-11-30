defmodule Game.Phase.Roll do
  @moduledoc """
  Roll phase
  """
  @behaviour Game.Phase

  alias Game.{
    Player,
    Phase,
    Dice,
    Turn
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, :start_phase) do
    %{turns: turns} = Phase.current(game)

    game
    |> Game.update_players(&Player.update(&1, %{turns: turns}))
  end

  def action(game, {:swap, index}) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.update_dice(index, &Dice.swap/1)
    end)
  end

  def action(game, :continue) do
    game
    |> Turn.get_player()
    |> case do
      %{turns: 1} ->
        game
        |> action(:roll)
        |> action(:keep)
        |> Turn.next()

      %{rolled: false} ->
        action(game, :roll)

      %{rolled: true} ->
        Turn.next(game)
    end
  end

  def action(game, :roll) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.update_dices(&Dice.roll/1)
      |> Player.update(%{rolled: true})
    end)
  end

  def action(game, :keep) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.update_dices(&Dice.keep/1)
    end)
  end

  def action(game, :end_turn) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.update_turns(-1)
      |> Player.update_dices(&Dice.lock/1)
    end)
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
