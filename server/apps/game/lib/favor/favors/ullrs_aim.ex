defmodule Game.Favor.UllrsAim do
  @behaviour Game.Favor
  @moduledoc """
  Ullrs Aim bypasses a fixed amount of ranged block dice.

  Tier 1: 2 ranged block bypasses for 2 God Favor.
  Tier 2: 3 ranged block bypasses for 3 God Favor.
  Tier 3: 6 ranged block bypasses for 6 God Favor.
  """
  alias Game.{
    Turn,
    Dice
  }

  @tiers %{
    1 => %{cost: 4, ranged_bypass: 2},
    2 => %{cost: 3, ranged_bypass: 3},
    3 => %{cost: 6, ranged_bypass: 6}
  }

  use Game.Favor

  @impl Game.Favor
  def invoke(game, options) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent.dices
      |> IndexMap.filter(fn dice ->
        Dice.Face.stance?(dice, :block) && Dice.Face.type?(dice, :ranged)
      end)
      |> IndexMap.take(options.ranged_bypass)
      |> IndexMap.update_in(opponent, :dices, fn dice ->
        dice
        |> Dice.update_face(%{disabled: true})
      end)
    end)
  end
end
