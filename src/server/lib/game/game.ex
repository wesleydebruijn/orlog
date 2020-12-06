defmodule Game do
  @moduledoc """
  Orlog, the Game: Clone of minigame from Assassin's Creed: Valhalla
  """
  alias Game.{
    Settings,
    Player,
    Dice,
    Turn,
    Round,
    Phase
  }

  @type t :: %Game{
          settings: Settings.t(),
          players: any(),
          winner: integer(),
          round: integer(),
          phase: integer(),
          turn: integer()
        }
  @derive Jason.Encoder
  defstruct settings: %Settings{}, players: %{}, winner: 0, round: 0, phase: 0, turn: 0

  @spec start([String.t()], Settings.t()) :: Game.t()
  def start(uuids, settings \\ %Settings{}) do
    %Game{
      settings: settings,
      players: IndexMap.add(%{}, Enum.map(uuids, fn uuid -> %Player{uuid: uuid} end))
    }
    |> IndexMap.update_all(:players, fn player ->
      player
      |> Player.update(%{
        health: settings.health,
        tokens: settings.tokens,
        dices: IndexMap.add(%{}, Enum.map(1..settings.dices, fn _x -> %Dice{} end)),
        favors: IndexMap.add(%{}, Enum.map(1..settings.favors, fn x -> x end))
      })
    end)
    |> Turn.coinflip()
    |> Round.next()
    |> Phase.next()
  end

  @spec invoke(Game.t(), any()) :: Game.t()
  def invoke(%{phase: 0} = game, _action), do: game

  def invoke(game, action) do
    %{module: module} = Map.get(game.settings.phases, game.phase)

    apply(module, :action, [game, action])
  end
end
