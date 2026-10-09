defmodule Game.Action.Dice do
  @moduledoc """
  Dice related actions
  """
  alias Game.{
    Player,
    Turn
  }

  @doc """
  Queues extra dice for the next Roll phase, `Game.Phase.Roll` adds them to the
  player's dice and `Game.Phase.Resolution` removes them again at the end of that round.
  """
  @spec add_extra_dices(Game.t(), integer()) :: Game.t()
  def add_extra_dices(game, amount) do
    game
    |> Turn.update_player(&Player.increase(&1, :extra_dices, amount))
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
      |> IndexMap.filter(fn dice -> !dice.face.disabled end)
      |> Enum.sort_by(&elem(&1, 0))
      |> Enum.group_by(fn {_index, %{face: face}} -> {face.stance, face.type} end)
      |> Map.values()
      # biggest group wins, on a tie the group with the lowest dice index
      |> Enum.max_by(fn [{first, _dice} | _] = group -> {length(group), -first} end, fn -> [] end)
      |> Enum.take(1)
      |> IndexMap.update_in(player, :dices, &Game.Dice.Face.increase(&1, :count, amount))
    end)
  end
end
