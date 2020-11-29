defmodule Game.Round do
  @moduledoc """
  Round
  """
  @spec determine_next(Game.t()) :: integer()
  def determine_next(game) do
    game.round + 1
  end

  @spec next(Game.t()) :: Game.t()
  def next(game) do
    round = determine_next(game)

    game
    |> Map.put(:round, round)
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
