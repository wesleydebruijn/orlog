defmodule Game do
  @moduledoc """
  Game
  """
  alias Game.{
    Player,
    Round,
    Phase
  }

  @settings %{
    health: 15,
    tokens: 0,
    rolls: 3,
    dices: 6
  }

  @type t :: %Game{
    players: [Player.t()],
    rounds: [Round.t()],
    phase: Phase.t(),
    turns: integer()
  }
  defstruct players: [], rounds: [], phase: nil, turns: 0, settings: %{}

  @spec start(String.t(), String.t()) :: Game.t()
  def start(user1, user2) do
    players =
      [user1, user2]
      |> Enum.map(fn user ->
        user
        |> Player.new()
        |> Player.add_health(@settings.health)
        |> Player.add_tokens(@settings.tokens)
      end)
      |> Player.assign_turn()

    %Game{settings: @settings, players: players}
  end

  @spec execute(Game.t(), any()) :: Game.t()
  def execute(game, action) do
    apply(game.phase, :execute, action)
  end

  @spec next_turn(Game.t()) :: Game.t()
  def next_turn(game) do
    %{game | players: Player.assign_turn(game.players), turns: game.turns + 1}
  end

  @spec next_phase(Game.t(), Phase.t()) :: Game.t()
  def next_phase(game, phase) do
    %{game | phase: phase, turns: 0}
  end

  @spec next_round(Game.t()) :: Game.t()
  def next_round(game) do
    %{game | rounds: [%Round{players: game.players} | game.rounds], phase: Phase.Roll}
  end
end

# game = Game.start("wes", "jef")
# game = Game.next_round(game)
