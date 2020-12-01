defmodule Game.Action.Dice do
  @moduledoc """
  Token related actions
  """
  alias Game.{
    Player,
    Turn
  }

  @spec add_extra_dices(Game.t(), integer()) :: Game.t()
  def add_extra_dices(game, amount) do
    game
    |> Turn.update_player(fn player ->
      dices =
        player.dices
        |> IndexMap.add(Enum.map(1..amount, fn _x -> %Game.Dice{} end))

      player
      |> Player.update(%{dices: dices})
    end)
  end

  @spec reroll_dices(Game.t(), integer()) :: Game.t()
  def reroll_dices(game, amount) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent.dices
      |> IndexMap.take_random(amount)
      |> IndexMap.update_in(opponent, :dices, &Game.Dice.roll!/1)
    end)
  end

  @spec disable_dices(Game.t(), integer()) :: Game.t()
  def disable_dices(game, amount) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent.dices
      |> IndexMap.take_random(amount)
      |> IndexMap.update_in(opponent, :dices, &Game.Dice.Face.update(&1, %{disabled: true}))
    end)
  end

  @spec increase_majority(Game.t(), integer()) :: Game.t()
  def increase_majority(game, amount) do
    game
    |> Turn.update_player(fn player ->
      player.dices
      |> IndexMap.majority(fn %{face: face} -> %{stance: face.stance, type: face.type} end)
      |> IndexMap.update_in(player, :dices, &Game.Dice.Face.increase(&1, :amount, amount))
    end)
  end
end
