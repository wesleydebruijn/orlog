defmodule Favor.VidarsMight do
  @behaviour Favor
  @moduledoc """
  Vidar's Might removes a number of melee defence rolls of the opponent.

  Tier 1: 2 melee defences for 2 God Favor.
  Tier 2: 4 melee defences for 3 God Favor.
  Tier 3: 6 melee defences for 6 God Favor.
  """
  alias Game.{
    Turn,
    Dice
  }

  @tiers %{
    1 => %{cost: 2, melee_bypass: 2},
    2 => %{cost: 3, melee_bypass: 4},
    3 => %{cost: 6, melee_bypass: 6}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent.dices
      |> IndexMap.filter(fn dice ->
        Dice.Face.stance?(dice, :block) && Dice.Face.type?(dice, :melee)
      end)
      |> IndexMap.take(options.melee_bypass)
      |> IndexMap.update_in(opponent, :dices, fn dice ->
        dice
        |> Game.Dice.update_face(%{disabled: true})
      end)
    end)
  end
end
