defmodule Game.Action do
  @moduledoc """
  Actions that occur during the game
  """
  alias Game.{
    Player,
    Turn,
    Dice.Face
  }

  @spec collect_tokens(Game.t()) :: Game.t()
  def collect_tokens(game) do
    tokens_to_collect =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> !dice.face.disabled end)
      |> IndexMap.sum(& &1.tokens)

    game
    |> Turn.update_player(&Player.update_tokens(&1, tokens_to_collect))
  end

  @spec attack_health(Game.t()) :: Game.t()
  def attack_health(game) do
    desired_health_to_attack =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> Face.stance?(dice, :attack) end)
      |> IndexMap.sum(&Face.hit_amount/1)

    if desired_health_to_attack > 0 do
      maximum_health_to_attack =
        game
        |> Turn.get_opponent()
        |> Map.get(:health)

      health_to_attack = Enum.min([desired_health_to_attack, maximum_health_to_attack])

      game
      |> Turn.update_opponent(&Player.update_health(&1, -health_to_attack))
    else
      game
    end
  end

  @spec steal_tokens(Game.t()) :: Game.t()
  def steal_tokens(game) do
    desired_tokens_to_steal =
      game
      |> Turn.get_player()
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> Face.type?(dice, :token) && Face.stance?(dice, :steal) end)
      |> IndexMap.sum(&Face.hit_amount/1)

    if desired_tokens_to_steal > 0 do
      maximum_tokens_to_steal =
        game
        |> Turn.get_opponent()
        |> Map.get(:tokens)

      tokens_to_steal = Enum.min([desired_tokens_to_steal, maximum_tokens_to_steal])

      game
      |> Turn.update_opponent(&Player.update_tokens(&1, -tokens_to_steal))
      |> Turn.update_player(&Player.update_tokens(&1, tokens_to_steal))
    else
      game
    end
  end
end
