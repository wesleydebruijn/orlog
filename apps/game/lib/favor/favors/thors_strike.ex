defmodule Favor.ThorsStrike do
  @behaviour Favor
  @moduledoc """
  Thor's Strike dishes out raw damage to the opponent player.

  Tier 1: 2 damage for 4 God Favor.
  Tier 2: 5 damage for 8 God Favor.
  Tier 3: 8 damage for 12 God Favor.
  """
  alias Game.{
    Turn
  }

  @tiers %{
    1 => %{cost: 4, damage: 2},
    2 => %{cost: 8, damage: 5},
    3 => %{cost: 12, damage: 8}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    game
    |> Turn.update_opponent(fn opponent ->
      opponent
      |> Game.Player.update_health(-options.damage)
    end)
  end
end
