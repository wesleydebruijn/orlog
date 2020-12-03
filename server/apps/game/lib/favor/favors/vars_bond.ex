defmodule Game.Favor.VarsBond do
  @behaviour Game.Favor

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
