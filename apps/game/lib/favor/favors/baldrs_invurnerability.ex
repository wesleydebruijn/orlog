defmodule Favor.BaldrsInvurnerability do
  @behaviour Favor
  @moduledoc """
  Baldr's Invurnerability increases your defence rolls by a fixed amount.

  Tier 1: +1 to melee and ranged block dice for 3 God Favor.
  Tier 2: +2 to melee and ranged block dice for 6 God Favor.
  Tier 3: +3 to melee and ranged block dice for 9 God Favor.
  """
  alias Game.{
    Turn,
    Player,
    Dice
  }

  @tiers %{
    1 => %{cost: 3, defence: 1},
    2 => %{cost: 6, defence: 2},
    3 => %{cost: 9, defence: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    game
    |> Turn.update_player(fn player ->
      player.dices
      |> IndexMap.filter(&Dice.Face.stance?(&1, :block))
      |> IndexMap.update_in(player, :dices, fn dice ->
        dice
        |> Dice.update_face(%{amount: dice.face.amount + options.defence})
      end)
    end)
  end
end
