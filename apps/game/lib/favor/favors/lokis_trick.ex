defmodule Favor.LokisTrick do
  @behaviour Favor
  @moduledoc """
  Loki's Trick enables you to ban a fixed amount of your opponents dice.

  Tier 1: bans 1 dice for 3 God Favor.
  Tier 2: bans 2 dice for 6 God Favor.
  Tier 3: bans 3 dice for 9 God Favor.
  """
  @tiers %{
    1 => %{cost: 3, bans: 1},
    2 => %{cost: 6, bans: 2},
    3 => %{cost: 9, bans: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    opponent = Game.opponent_player(game)

    dices_to_ban =
      1..options.bans
      |> Enum.reduce([], fn _index, acc ->
        random = Enum.to_list(1..Enum.count(opponent.dices))
        acc ++ [Enum.random(random -- acc)]
      end)

    updated_opponent =
      opponent
      |> Map.get(:dices)
      |> Enum.filter(fn {index, _die} ->
        index in dices_to_ban
      end)
      |> Enum.reduce(opponent, fn {index, _die}, acc ->
        Game.Player.update_dice(acc, index, fn die ->
          Game.Dice.update_face(die, %{
            disabled: true
          })
        end)
      end)

    Game.update_opponent_player(game, updated_opponent)
  end
end
