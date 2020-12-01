defmodule FavorFixture do
  @tiers %{
    1 => %{cost: 4},
    2 => %{cost: 8},
    3 => %{cost: 12}
  }

  use Game.Favor

  def invoke(game, tier) do
    send(self(), tier)
    game
  end
end
