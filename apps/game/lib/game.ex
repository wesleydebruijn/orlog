defmodule Game do
  @moduledoc """
  Game
  """
  alias Game.{
    Settings,
    Player,
    Round
  }

  @settings %Settings{}

  @type t :: %Game{
          players: any(),
          rounds: [Round.t()],
          phase: integer(),
          turn: integer()
        }
  defstruct players: %{}, rounds: [], phase: 0, turn: nil, settings: %{}

  @spec start(String.t(), String.t()) :: Game.t()
  def start(user1, user2) do
    %Game{
      settings: @settings,
      turn: Enum.random(1..2),
      players:
        [user1, user2]
        |> Enum.with_index(1)
        |> Enum.into(%{}, fn {user, index} -> {index, Player.new(user, @settings)} end)
    }
    |> next_phase()
  end

  @spec determine_next_turn(Game.t()) :: integer()
  def determine_next_turn(game) do
    if game.turn + 1 > Enum.count(game.players), do: 1, else: game.turn + 1
  end

  @spec determine_next_phase(Game.t()) :: integer()
  def determine_next_phase(game) do
    if game.phase + 1 > Enum.count(game.settings.phases), do: 1, else: game.phase + 1
  end

  @spec next_turn(Game.t()) :: Game.t()
  def next_turn(game) do
    turn = determine_next_turn(game)
    current_player =
      game
      |> current_player()
      |> Player.update_turns(-1)

    game
    |> update_current_player(current_player)
    |> Map.put(:turn, turn)
    |> try_next_phase()
  end

  @spec next_phase(Game.t()) :: Game.t()
  def next_phase(game) do
    phase = determine_next_phase(game)
    %{turns: turns} = Map.get(game.settings.phases, phase)

    %{game | phase: phase}
    |> update_players(&Player.set_turns(&1, turns))
  end

  @spec try_next_phase(Game.t()) :: Game.t()
  def try_next_phase(game) do
    no_turns_left = Enum.all?(game.players, fn {_i, player} -> player.turns <= 0 end)

    if no_turns_left do
      next_phase(game)
    else
      game
    end
  end

  @spec current_player(Game.t()) :: Player.t()
  def current_player(game) do
    Map.get(game.players, game.turn)
  end

  @spec opponent_player(Game.t()) :: Player.t()
  def opponent_player(game) do
    Map.get(game.players, determine_next_turn(game))
  end

  @spec update_players(Game.t(), fun()) :: Game.t()
  def update_players(game, fun) do
    players =
      game.players
      |> Enum.into(%{}, fn {id, player} -> {id, fun.(player)} end)

    %{game | players: players}
  end

  @spec update_current_player(Game.t(), Player.t()) :: Game.t()
  def update_current_player(game, player) do
    %{game | players: Map.put(game.players, game.turn, player)}
  end

  @spec update_opponent_player(Game.t(), Player.t()) :: Game.t()
  def update_opponent_player(game, player) do
    %{game | players: Map.put(game.players, determine_next_turn(game), player)}
  end
end
