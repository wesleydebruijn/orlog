defmodule Favor.BrunhildsFury do
  @behaviour Favor
  @moduledoc """
  Brunhild's Fury multiplies your melee attack dice.

  Tier 1: multiplies melee attack dice by 1.5 for 6 God Favor.
  Tier 2: multiplies melee attack dice by 2 for 10 God Favor.
  Tier 3: multiplies melee attack dice by 3 for 18 God Favor.
  """
  alias Game.{
    Player,
    Dice,
    Turn
  }

  @tiers %{
    1 => %{cost: 6, melee_multiplier: 1.5},
    2 => %{cost: 10, melee_multiplier: 2},
    3 => %{cost: 18, melee_multiplier: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    game
    |> Turn.update_player(fn player ->
      player.dices
      |> IndexMap.filter(fn dice ->
        Dice.Face.stance?(dice, :attack) && Dice.Face.type?(dice, :melee)
      end)
      |> IndexMap.update_in(player, :dices, fn dice ->
        dice
        |> Dice.update_face(%{amount: dice.face.amount * options.melee_multiplier})
      end)
    end)
  end
end
