defmodule Game.Favor.FriggsSight do
  @behaviour Game.Favor
  @moduledoc """
  Friggs Sight forces the opponent to reroll a fixed amount of die.

  Tier 1: opponent rerolls 2 die for 2 God Favor.
  Tier 2: opponent rerolls 3 die for 3 God Favor.
  Tier 3: opponent rerolls 4 die for 4 God Favor.
  """
  @tiers %{
    1 => %{cost: 4, damage: 2},
    2 => %{cost: 8, damage: 5},
    3 => %{cost: 12, damage: 8}
  }

  use Game.Favor

  @impl Game.Favor
  def invoke(game, _options) do
    # TODO: Implement
    game
  end
end
