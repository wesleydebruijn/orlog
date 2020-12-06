defmodule Game.FakeAction do
  @spec invoke(Game.t(), integer()) :: Game.t()
  def invoke(game, amount) do
    game
    |> Game.Turn.update_player(&Game.Player.update(&1, %{health: amount}))
  end
end
