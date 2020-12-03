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

  @spec heal_on_block(Game.t(), integer(), atom()) :: Game.t()
  def heal_on_block(game, amount, type \\ nil) do
    game
    |> Turn.update_player(fn player ->
      blocks =
        player.dices
        |> IndexMap.filter(fn dice ->
          Dice.stance?(dice, :block) && (!type || Dice.type?(dice, type))
        end)
        |> IndexMap.sum(&Dice.Face.hits(&1))

      player
      |> Player.increase(:health, blocks * amount)
    end)
  end

  @spec heal_on_receive_ranged_attack(Game.t(), integer()) :: Game.t()
  def heal_on_receive_ranged_attack(game, amount),
    do: heal_on_receive_attack(game, amount, :ranged)

  @spec heal_on_receive_melee_attack(Game.t(), integer()) :: Game.t()
  def heal_on_receive_melee_attack(game, amount), do: heal_on_receive_attack(game, amount, :melee)

  @spec heal_on_receive_attack(Game.t(), integer(), atom()) :: Game.t()
  def heal_on_receive_attack(game, amount, type \\ nil) do
    attacks =
      game
      |> Turn.get_opponent()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice ->
        Dice.stance?(dice, :attack) && (!type || Dice.type?(dice, type))
      end)
      |> IndexMap.sum(&Dice.Face.hits/1)

    game
    |> Turn.update_player(&Player.increase(&1, :health, attacks * amount))
  end

  @spec heal_on_tokens_spent(Game.t(), integer()) :: Game.t()
  def heal_on_tokens_spent(game, amount) do
    game
    |> Turn.get_opponent()
    |> Player.get_favor()
    |> Map.get(:tier)
    |> case do
      %{cost: cost} ->
        game
        |> Turn.update_player(&Player.increase(&1, :health, cost * amount))

      _other ->
        game
    end
  end
end
