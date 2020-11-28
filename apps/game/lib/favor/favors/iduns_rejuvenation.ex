defmodule Favor.IdunsRejuvenation do
  @behaviour Favor
  @moduledoc """
  Idun's Rejuvenation heals the current player for a fixed amount of health.

  Tier 1: 2 health for 4 God Favor.
  Tier 2: 4 health for 7 God Favor.
  Tier 3: 6 health for 10 God Favor.
  """
  @tiers %{
    1 => %{cost: 4, heal: 2},
    2 => %{cost: 7, heal: 4},
    3 => %{cost: 10, heal: 6}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player =
      game
      |> Game.current_player()
      |> Game.Player.update_health(options.heal)

    Game.update_current_player(game, player)
  end
end
