defmodule Game.Turn do
  @moduledoc """
  Turn
  """

  @spec coinflip(Game.t()) :: Game.t()
  def coinflip(game) do
    turn =
      game.players
      |> Map.keys()
      |> Enum.random()

    %{game | turn: turn}
  end

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

  @spec get_player(Game.t()) :: Player.t()
  def get_player(game) do
    Game.get_player(game, game.turn)
  end

  @spec update_player(Game.t(), fun()) :: Game.t()
  def update_player(game, fun) do
    Game.update_player(game, game.turn, fun)
  end

  @spec get_opponent(Game.t()) :: Player.t()
  def get_opponent(game) do
    Game.get_player(game, determine_next(game))
  end

  @spec update_opponent(Game.t(), fun()) :: Game.t()
  def update_opponent(game, fun) do
    Game.update_player(game, determine_next(game), fun)
  end
end
