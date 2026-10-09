defmodule Game.Action.Attack do
  @moduledoc """
  Attack related actions
  """
  alias Game.{
    Player,
    Turn,
    Dice
  }

  @spec attack_health(Game.t()) :: Game.t()
  def attack_health(game) do
    desired_health_to_attack =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(&Dice.stance?(&1, :attack))
      |> IndexMap.sum(&Dice.Face.hit_amount/1)

    desired_health_to_attack = ceil(desired_health_to_attack)

    if desired_health_to_attack > 0 do
      maximum_health_to_attack =
        game
        |> Turn.get_opponent()
        |> Map.get(:health)

      health_to_attack = Enum.min([desired_health_to_attack, maximum_health_to_attack])

      game
      |> Turn.update_opponent(&Player.increase(&1, :health, -health_to_attack))
    else
      game
    end
  end

  @spec attack_health(Game.t(), integer()) :: Game.t()
  def attack_health(game, amount) do
    game
    |> Turn.update_opponent(&Player.increase(&1, :health, -amount))
  end

  @spec multiply_ranged_attack(Game.t(), number()) :: Game.t()
  def multiply_ranged_attack(game, amount), do: multiply_attack(game, amount, :ranged)

  @spec multiply_melee_attack(Game.t(), number()) :: Game.t()
  def multiply_melee_attack(game, amount), do: multiply_attack(game, amount, :melee)

  @doc """
  Multiplies the damage (`amount`) of attack dice, the number of attacks that
  can be blocked (`count`) stays the same.
  """
  @spec multiply_attack(Game.t(), number(), atom()) :: Game.t()
  def multiply_attack(game, amount, type \\ nil) do
    update_attack(game, type, &Dice.Face.multiply(&1, :amount, amount))
  end

  @spec increase_ranged_attack(Game.t(), integer()) :: Game.t()
  def increase_ranged_attack(game, amount), do: increase_attack(game, amount, :ranged)

  @spec increase_melee_attack(Game.t(), integer()) :: Game.t()
  def increase_melee_attack(game, amount), do: increase_attack(game, amount, :melee)

  @doc """
  Adds extra damage (`amount`) to attack dice.
  """
  @spec increase_attack(Game.t(), integer(), atom()) :: Game.t()
  def increase_attack(game, amount, type \\ nil) do
    update_attack(game, type, &Dice.Face.increase(&1, :amount, amount))
  end

  defp update_attack(game, type, fun) do
    game
    |> Turn.update_player(fn player ->
      player.dices
      |> IndexMap.filter(fn dice ->
        Dice.stance?(dice, :attack) && (!type || Dice.type?(dice, type))
      end)
      |> IndexMap.update_in(player, :dices, fun)
    end)
  end
end
