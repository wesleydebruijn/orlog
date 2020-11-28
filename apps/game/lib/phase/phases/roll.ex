defmodule Game.Phase.Roll do
  @moduledoc """
  Roll phase
  """
  @behaviour Game.Phase

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, {:swap, index}) do
    player =
      game
      |> Game.current_player()
      |> Game.Player.update_dice(index, &Game.Dice.swap/1)

    Game.update_current_player(game, player)
  end

  def action(game, :end_turn) do
    player = Game.current_player(game)
    updated_player =
      player.dices
      |> Enum.filter(fn {_i, dice} -> dice.keep end)
      |> Enum.map(&elem(&1, 0))
      |> Enum.reduce(player, fn index, acc -> Game.Player.update_dice(acc, index, &Game.Dice.lock/1) end)
      |> Game.Player.update_turns(-1)

    Game.update_current_player(game, updated_player)
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
