defmodule Game.Favor.LokisTrick do
  @behaviour Game.Favor
  @moduledoc """
  Loki's Trick enables you to ban a fixed amount of your opponents dice.

  Tier 1: bans 1 dice for 3 God Favor.
  Tier 2: bans 2 dice for 6 God Favor.
  Tier 3: bans 3 dice for 9 God Favor.
  """
  alias Game.{
    Turn
  }

  @tiers %{
    1 => %{cost: 3, bans: 1},
    2 => %{cost: 6, bans: 2},
    3 => %{cost: 9, bans: 3}
  }

  use Game.Favor

  @impl Game.Favor
  def invoke(game, options) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent.dices
      |> IndexMap.take_random(options.bans)
      |> IndexMap.update_in(opponent, :dices, fn dice ->
        dice
        |> Game.Dice.update_face(%{disabled: true})
      end)
    end)
  end
end
