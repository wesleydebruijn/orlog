defmodule Game.Phase.Roll do
  @moduledoc """
  Roll phase
  """
  @behaviour Game.Phase

  alias Game.{
    Player,
    Dice
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, {:swap, index}) do
    player =
      game
      |> Game.current_player()
      |> Player.update_dice(index, &Dice.swap/1)

    Game.update_current_player(game, player)
  end

  def action(game, :roll) do
    player =
      game
      |> Game.current_player()
      |> case do
        %{rolled: true} = player ->
          player

        %{rolled: false} = player ->
          player
          |> Player.update_dices(&Dice.roll/1)
          |> Player.update(%{rolled: true})
      end

    Game.update_current_player(game, player)
  end

  def action(game, :end_turn) do
    player =
      game
      |> Game.current_player()
      |> Player.update_turns(-1)
      |> case do
        %{turns: 0} = player -> Player.update_dices(player, &Dice.keep/1)
        player -> player
      end
      |> Player.update_dices(&Dice.lock/1)

    Game.update_current_player(game, player)
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
