defmodule Favor.FriggsSight do
  @behaviour Favor

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
