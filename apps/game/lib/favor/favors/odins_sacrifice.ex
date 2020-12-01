defmodule Game.Favor.OdinsSacrifice do
  @behaviour Game.Favor
  @moduledoc """
  Odin's Sacrifice heals you for a fixed amount of health per tier.

  Tier 1: heals 3 health for 6 God Favor.
  Tier 2: heals 4 health for 8 God Favor.
  Tier 3: heals 5 health for 10 God Favor.
  """
  alias Game.{
    Turn
  }

  @tiers %{
    1 => %{cost: 6, heal: 3},
    2 => %{cost: 8, heal: 4},
    3 => %{cost: 10, heal: 5}
  }

  use Game.Favor

  @impl Game.Favor
  def invoke(game, options) do
    game
    |> Turn.update_player(&Game.Player.update_health(&1, options.heal))
  end
end
