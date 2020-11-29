defmodule Game.Turn do
  @moduledoc """
  Turn
  """

  @spec determine_next_turn(Game.t()) :: integer()
  def determine_next_turn(game) do
    if game.turn + 1 > Enum.count(game.players), do: 1, else: game.turn + 1
  end

  @spec next_turn(Game.t()) :: Game.t()
  def next_turn(game) do
    turn = determine_next_turn(game)

    game
    |> Game.do_action(:end_turn)
    |> Game.Phase.try_next()
    |> Map.put(:turn, turn)
    |> Game.do_action(:start_turn)
  end
end
