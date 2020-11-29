defmodule Game.Turn do
  @moduledoc """
  Turn
  """

  @spec determine_next(Game.t()) :: integer()
  def determine_next(game) do
    if game.turn + 1 > Enum.count(game.players), do: 1, else: game.turn + 1
  end

  @spec next(Game.t()) :: Game.t()
  def next(game) do
    turn = determine_next(game)

    game
    |> Game.do_action(:end_turn)
    |> Game.Phase.try_next()
    |> Map.put(:turn, turn)
    |> Game.do_action(:start_turn)
  end
end
