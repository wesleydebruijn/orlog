defmodule Game.Round do
  @moduledoc """
  Cycle of a collection of phases in a game
  """
  alias Game.Turn

  @spec determine_next(Game.t()) :: integer()
  def determine_next(game) do
    game.round + 1
  end

  @spec next(Game.t(), function()) :: Game.t()
  def next(game, fun \\ &Turn.determine_next/1) do
    round = determine_next(game)

    turn = fun.(game)

    game
    |> Map.put(:round, round)
    |> Map.put(:turn, turn)
    |> Map.put(:start, turn)
  end

  @spec try_next(Game.t()) :: Game.t()
  def try_next(game) do
    no_phase_left = game.phase == Enum.count(game.settings.phases)

    if no_phase_left do
      next(game)
    else
      game
    end
  end
end
