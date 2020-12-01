defmodule Game.Action.Heal do
  @moduledoc """
  Heal related actions
  """
  alias Game.{
    Player,
    Turn,
    Dice
  }

  @spec heal(Game.t(), integer()) :: Game.t()
  def heal(game, amount) do
    game
    |> Turn.update_player(&Game.Player.increase(&1, :health, amount))
  end

  @spec heal_on_ranged_block(Game.t(), integer()) :: Game.t()
  def heal_on_ranged_block(game, amount), do: heal_on_block(game, amount, :ranged)

  @spec heal_on_melee_block(Game.t(), any) :: Game.t()
  def heal_on_melee_block(game, amount), do: heal_on_block(game, amount, :melee)

  @spec heal_on_block(Game.t(), integer(), atom() | nil) :: Game.t()
  def heal_on_block(game, amount, type) do
    game
    |> Turn.update_player(fn player ->
      blocks =
        player.dices
        |> IndexMap.filter(fn dice ->
          Dice.Face.stance?(dice, :block) && (!type || Dice.Face.type?(dice, type))
        end)
        |> IndexMap.sum(&Dice.Face.hits/1)

      player
      |> Player.increase(:health, blocks * amount)
    end)
  end

  @spec heal_on_ranged_attack(Game.t(), integer()) :: Game.t()
  def heal_on_ranged_attack(game, amount), do: heal_on_attack(game, amount, :ranged)

  @spec heal_on_melee_attack(Game.t(), integer()) :: Game.t()
  def heal_on_melee_attack(game, amount), do: heal_on_attack(game, amount, :melee)

  @spec heal_on_attack(Game.t(), integer(), atom() | nil) :: Game.t()
  def heal_on_attack(game, amount, type) do
    game
    |> Turn.update_player(fn player ->
      attacks =
        game
        |> Turn.get_opponent()
        |> Map.get(:dices)
        |> IndexMap.filter(fn dice ->
          Dice.Face.stance?(dice, :block) && (!type || Dice.Face.type?(dice, type))
        end)
        |> IndexMap.sum(&Dice.Face.hits/1)

      player
      |> Player.increase(:health, attacks * amount)
    end)
  end
end
