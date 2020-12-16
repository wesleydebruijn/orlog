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

  def action(game, {:toggle, index}) do
    game
    |> Turn.update_player(fn player ->
      if player.rolled do
        player
        |> IndexMap.update(:dices, index, &Dice.swap/1)
      else
        player
      end
    end)
  end

  def action(game, :continue) do
    player = Turn.get_player(game)

    if player.rolled ||
         Enum.count(IndexMap.filter(player.dices, fn dice -> !dice.locked end)) == 0 do
      Turn.next(game)
    else
      action(game, :roll)
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

  def action(game, :end_turn) do
    game
    |> Turn.get_player()
    |> case do
      %{turns: 1} ->
        game
        |> Turn.update_player(fn player ->
          player
          |> IndexMap.update_all(:dices, &Dice.keep/1)
        end)

      _other ->
        game
    end
    |> Turn.update_player(fn player ->
      player
      |> Player.increase(:turns, -1)
      |> Player.update(%{rolled: false})
      |> IndexMap.update_all(:dices, &Dice.lock/1)
    end)
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
