defmodule Game.Turn do
  @moduledoc """
  Turn is assigned and switched between players in the game
  """

  @spec coinflip(Game.t()) :: integer()
  def coinflip(game) do
    game.players
    |> Map.keys()
    |> Enum.random()
  end

  @spec determine_next(Game.t()) :: integer()
  def determine_next(game) do
    if game.turn + 1 > Enum.count(game.players), do: 1, else: game.turn + 1
  end

  @spec next(Game.t()) :: Game.t()
  def next(game) do
    turn = determine_next(game)

    game
    |> Game.invoke(:end_turn)
    |> Map.put(:turn, turn)
    |> Game.Phase.try_next()
    |> Game.invoke(:start_turn)
  end

  @spec opponent(Game.t(), fun()) :: Game.t()
  def opponent(game, fun) do
    game
    |> Map.put(:turn, determine_next(game))
    |> fun.()
    |> Map.put(:turn, game.turn)
  end

  @spec get_player(Game.t()) :: Player.t()
  def get_player(game) do
    IndexMap.get(game.players, game.turn)
  end

  @spec update_player(Game.t(), fun()) :: Game.t()
  def update_player(game, fun) do
    IndexMap.update(game, :players, game.turn, fun)
  end

  @spec get_opponent(Game.t()) :: Player.t()
  def get_opponent(game) do
    IndexMap.get(game.players, determine_next(game))
  end

  @spec update_opponent(Game.t(), fun()) :: Game.t()
  def update_opponent(game, fun) do
    IndexMap.update(game, :players, determine_next(game), fun)
  end
end
