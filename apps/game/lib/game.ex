defmodule Game do
  @moduledoc """
  Game
  """
  alias Game.{
    Settings,
    Player,
    Round,
    Phase
  }

  @settings %Settings{
    health: 15,
    tokens: 0,
    rolls: 3,
    dices: 6
  }

  @type t :: %Game{
          players: any(),
          rounds: [Round.t()],
          phase: Phase.t(),
          turn: integer()
        }
  defstruct players: %{}, rounds: [], phase: nil, turn: nil, settings: %{}

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
  end

  @spec execute(Game.t(), any()) :: Game.t()
  def execute(game, action) do
    apply(game.phase, :execute, action)
  end

  @spec determine_next_turn(Game.t()) :: integer()
  def determine_next_turn(game) do
    if game.turn + 1 > Enum.count(game.players), do: 1, else: game.turn + 1
  end

  @spec next_turn(Game.t()) :: Game.t()
  def next_turn(game) do
    %{game | turn: determine_next_turn(game)}
  end

  @spec next_phase(Game.t(), Phase.t()) :: Game.t()
  def next_phase(game, phase) do
    %{game | phase: phase}
  end

  @spec next_round(Game.t()) :: Game.t()
  def next_round(game) do
    %{game | rounds: [%Round{players: game.players} | game.rounds], phase: Phase.Roll}
  end

  @spec current_player(Game.t()) :: Player.t()
  def current_player(game) do
    Map.get(game.players, game.turn)
  end

  @spec opponent_player(Game.t()) :: Player.t()
  def opponent_player(game) do
    Map.get(game.players, determine_next_turn(game))
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
