defmodule Favor.OdinsSacrifice do
  @behaviour Favor

  @tiers %{
    1 => %{cost: 6, heal: 3},
    2 => %{cost: 8, heal: 4},
    3 => %{cost: 10, heal: 5}
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
