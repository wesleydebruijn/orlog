defmodule Game.Phase do
  @moduledoc """
  Players have X turns to do certain actions
  """
  @callback action(Game.t(), any()) :: Game.t()

  @spec current(Game.t()) :: map()
  def current(game) do
    Map.get(game.settings.phases, game.phase)
  end

  @spec determine_next(Game.t()) :: integer()
  def determine_next(game) do
    if game.phase + 1 > Enum.count(game.settings.phases), do: 1, else: game.phase + 1
  end

  @spec next(Game.t()) :: Game.t()
  def next(game) do
    phase = determine_next(game)

    game
    |> Game.invoke(:end_phase)
    |> Game.Round.try_next()
    |> Map.put(:phase, phase)
    |> Game.invoke(:start_phase)
  end

  @spec try_next(Game.t()) :: Game.t()
  def try_next(game) do
    no_turns_left = Enum.all?(game.players, fn {_i, player} -> player.turns <= 0 end)

    if no_turns_left do
      next(game)
    else
      game
    end
  end
end
