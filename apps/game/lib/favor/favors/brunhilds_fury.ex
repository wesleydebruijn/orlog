defmodule Favor.BrunhildsFury do
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
    opponent = game.opponent_player(game)

    game
  end
end
