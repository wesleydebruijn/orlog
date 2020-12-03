defmodule Game.Action.Block do
  @moduledoc """
  Block related actions
  """
  alias Game.{
    Turn,
    Dice
  }

  @spec increase_ranged_block(Game.t(), integer) :: Game.t()
  def increase_ranged_block(game, amount), do: increase_block(game, amount, :ranged)

  @spec increase_melee_block(Game.t(), integer) :: Game.t()
  def increase_melee_block(game, amount), do: increase_block(game, amount, :melee)

  @spec increase_block(Game.t(), integer(), atom()) :: Game.t()
  def increase_block(game, amount, type \\ nil) do
    game
    |> Turn.update_player(fn player ->
      player.dices
      |> IndexMap.filter(fn dice ->
        Dice.stance?(dice, :block) && (!type || Dice.type?(dice, type))
      end)
      |> IndexMap.update_in(player, :dices, &Dice.Face.increase(&1, :amount, amount))
    end)
  end

  @spec bypass_ranged_block(Game.t(), integer()) :: Game.t()
  def bypass_ranged_block(game, amount), do: bypass_block(game, amount, :ranged)

  @spec bypass_melee_block(Game.t(), any) :: Game.t()
  def bypass_melee_block(game, amount), do: bypass_block(game, amount, :melee)

  @spec bypass_block(Game.t(), integer(), atom()) :: Game.t()
  def bypass_block(game, amount, type \\ nil) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent.dices
      |> IndexMap.filter(fn dice ->
        Dice.stance?(dice, :block) && (!type || Dice.type?(dice, type))
      end)
      |> IndexMap.take(amount)
      |> IndexMap.update_in(opponent, :dices, &Dice.Face.update(&1, %{disabled: true}))
    end)
  end
end
