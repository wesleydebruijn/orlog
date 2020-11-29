defmodule Favor.MimirsWisdom do
  @behaviour Favor
  @moduledoc """
   Mimirs Wisdom gives you God Favor per damage dealth to you this round.

  Tier 1: you gain 1 God Favor per damage for 3 God Favor.
  Tier 2: you gain 2 God Favor per damage for 5 God Favor.
  Tier 3: you gain 3 God Favor per damage for 7 God Favor.
  """
  @tiers %{
    1 => %{cost: 4, damage: 2},
    2 => %{cost: 8, damage: 5},
    3 => %{cost: 12, damage: 8}
  }

  use Favor

  @impl Favor
  def invoke(game, _options) do
    # TODO: Implement
    game
  end
end
