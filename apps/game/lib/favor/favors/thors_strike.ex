defmodule Favor.ThorsStrike do
  @behaviour Favor

  @tiers %{
    1 => %{cost: 4, damage: 2},
    2 => %{cost: 8, damage: 5},
    3 => %{cost: 12, damage: 8}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    %{cost: cost, damage: damage} = options
    IO.puts("doing ThorsStrike with #{damage} damage and #{cost} cost")
    game
  end
end
