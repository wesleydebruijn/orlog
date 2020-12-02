defmodule Game.Action.Token do
  @moduledoc """
  Token related actions
  """
  alias Game.{
    Player,
    Turn,
    Dice
  }

  @spec steal_tokens(Game.t()) :: Game.t()
  def steal_tokens(game) do
    desired_tokens_to_steal =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> Dice.type?(dice, :token) && Dice.stance?(dice, :steal) end)
      |> IndexMap.sum(&Dice.Face.hit_amount/1)

    if desired_tokens_to_steal > 0 do
      maximum_tokens_to_steal =
        game
        |> Turn.get_opponent()
        |> Map.get(:tokens)

      tokens_to_steal = Enum.min([desired_tokens_to_steal, maximum_tokens_to_steal])

      game
      |> Turn.update_opponent(&Player.increase(&1, :tokens, -tokens_to_steal))
      |> Turn.update_player(&Player.increase(&1, :tokens, tokens_to_steal))
    else
      game
    end
  end

  @spec collect_tokens(Game.t()) :: Game.t()
  def collect_tokens(game) do
    tokens_to_collect =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> !dice.face.disabled end)
      |> IndexMap.sum(& &1.tokens)

    game
    |> Turn.update_player(&Player.increase(&1, :tokens, tokens_to_collect))
  end

  @spec tokens_on_damage(Game.t(), integer()) :: Game.t()
  def tokens_on_damage(game, amount) do
    damage =
      game
      |> Turn.get_opponent()
      |> Map.get(:dices)
      |> IndexMap.filter(&Dice.stance?(&1, :attack))
      |> IndexMap.sum(&Dice.Face.hit_amount/1)

    game
    |> Turn.update_player(&Player.increase(&1, :tokens, damage * amount))
  end

  @spec destroy_tokens_on_ranged_attack(Game.t(), integer()) :: Game.t()
  def destroy_tokens_on_ranged_attack(game, amount) do
    dices =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> Dice.stance?(dice, :attack) && Dice.type?(dice, :ranged) end)
      |> Enum.count()

    game
    |> Turn.update_opponent(&Player.increase(&1, :tokens, -(dices * amount)))
  end

  @spec decrease_favor_tier(Game.t(), integer()) :: Game.t()
  def decrease_favor_tier(game, _amount) do
    game
  end
end
