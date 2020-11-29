defmodule Game do
  @moduledoc """
  Game
  """
  alias Game.{
    Settings,
    Player,
    Turn,
    Round,
    Phase
  }

  @type t :: %Game{
          players: any(),
          round: integer(),
          phase: integer(),
          turn: integer()
        }
  defstruct players: %{}, phase: 0, round: 0, turn: nil, settings: %Settings{}

  @spec start(String.t(), String.t()) :: Game.t()
  def start(user1, user2) do
    game = %Game{
      turn: Enum.random(1..2),
      players: %{
        1 => %Player{user: user1},
        2 => %Player{user: user2}
      }
    }

    game
    |> update_players(fn player ->
      %{health: health, tokens: tokens, dices: dices} = game.settings

      player
      |> Player.update_health(health)
      |> Player.update_tokens(tokens)
      |> Player.set_dices(dices)
    end)
    |> Round.next()
    |> Phase.next()
  end

  @spec do_action(Game.t(), any()) :: Game.t()
  def do_action(%{phase: 0} = game, _action), do: game
  def do_action(game, action) do
    %{module: module} = Map.get(game.settings.phases, game.phase)

    apply(module, :action, [game, action])
  end

  @spec current_player(Game.t()) :: Player.t()
  def current_player(game) do
    Map.get(game.players, game.turn)
  end

  @spec opponent_player(Game.t()) :: Player.t()
  def opponent_player(game) do
    Map.get(game.players, Turn.determine_next_turn(game))
  end

  @spec update_players(Game.t(), fun()) :: Game.t()
  def update_players(game, fun) do
    players = Enum.into(game.players, %{}, fn {id, player} -> {id, fun.(player)} end)

    %{game | players: players}
  end

  @spec update_current_player(Game.t(), Player.t()) :: Game.t()
  def update_current_player(game, player) do
    %{game | players: Map.put(game.players, game.turn, player)}
  end

  @spec update_opponent_player(Game.t(), Player.t()) :: Game.t()
  def update_opponent_player(game, player) do
    %{game | players: Map.put(game.players, Turn.determine_next_turn(game), player)}
  end
end
