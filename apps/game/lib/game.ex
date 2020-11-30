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
          settings: Settings.t(),
          players: any(),
          round: integer(),
          phase: integer(),
          turn: integer()
        }
  defstruct settings: %Settings{}, players: %{}, round: 0, phase: 0, turn: 0

  @spec start([String.t()], Settings.t()) :: Game.t()
  def start(users, settings \\ %Settings{}) do
    %Game{
      settings: settings,
      players: Player.create(users)
    }
    |> Game.update_players(fn player ->
      player
      |> Player.update_health(settings.health)
      |> Player.update_tokens(settings.tokens)
      |> Player.set_dices(settings.dices)
    end)
    |> Turn.coinflip()
    |> Round.next()
    |> Phase.next()
  end

  @spec do_action(Game.t(), any()) :: Game.t()
  def do_action(%{phase: 0} = game, _action), do: game

  def do_action(game, action) do
    %{module: module} = Map.get(game.settings.phases, game.phase)

    apply(module, :action, [game, action])
  end

  @spec get_player(Game.t(), integer()) :: Player.t()
  def get_player(game, index) do
    Map.get(game.players, index)
  end

  @spec update_players(Game.t(), fun()) :: Game.t()
  def update_players(game, fun) do
    players = Enum.into(game.players, %{}, fn {id, player} -> {id, fun.(player)} end)

    %{game | players: players}
  end

  @spec update_player(Game.t(), integer(), fun()) :: Game.t()
  def update_player(game, index, fun) do
    player =
      game.players
      |> Map.get(index)
      |> fun.()

    %{game | players: Map.put(game.players, index, player)}
  end
end
