defmodule Game.Phase.Roll do
  @moduledoc """
  Players roll dices for X turns,
  after each roll a player can swap out dices to keep
  during next phase of the game
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
    |> IndexMap.update_all(:players, fn player ->
      player
      |> Player.update(%{turns: turns})
      |> IndexMap.update_all(:dices, &Dice.unlock/1)
    end)
  end

  def action(game, {:swap, index}) do
    game
    |> Turn.update_player(fn player ->
      player
      |> IndexMap.update(:dices, index, &Dice.swap/1)
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
      |> IndexMap.update_all(:dices, &Dice.roll/1)
      |> Player.update(%{rolled: true})
    end)
  end

  def action(game, :keep) do
    game
    |> Turn.update_player(fn player ->
      player
      |> IndexMap.update_all(:dices, &Dice.keep/1)
    end)
  end

  def action(game, :end_turn) do
    game
    |> Turn.update_player(fn player ->
      player
      |> Player.increase(:turns, -1)
      |> IndexMap.update_all(:dices, &Dice.lock/1)
    end)
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
