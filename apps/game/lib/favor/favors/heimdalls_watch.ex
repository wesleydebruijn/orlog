defmodule Game.Favor.HeimdallsWatch do
  @behaviour Game.Favor
  @moduledoc """
  Heimdalls Watch grants health for each succesful block.

  Tier 1: each succesful block heals 1 for 4 God Favor.
  Tier 2: each succesful block heals 2 for 7 God Favor.
  Tier 3: each succesful block heals 3 for 10 God Favor.
  """
  alias Game.{
    Turn,
    Dice
  }

  @tiers %{
    1 => %{cost: 4, block_heal: 1},
    2 => %{cost: 7, block_heal: 2},
    3 => %{cost: 10, block_heal: 3}
  }

  use Game.Favor

  @impl Game.Favor
  def invoke(game, options) do
    game
    |> Turn.update_player(fn player ->
      player.dices
      |> IndexMap.filter(&Dice.Face.stance?(&1, :block))
      |> IndexMap.update_in(player, :dices, fn dice ->
        dice
        |> Dice.update_face(%{health: options.block_heal})
      end)
    end)
  end
end
