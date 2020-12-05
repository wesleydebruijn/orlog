defmodule Game.Lobby do
  @moduledoc """
  Game lobby
  """
  alias Game.{
    Lobby,
    Settings
  }

  require Logger

  @pids 2
  @type t :: %Lobby{
          uuid: String.t(),
          turn: integer(),
          status: :waiting | :playing,
          settings: Settings.t(),
          game: Game.t(),
          pids: %{}
        }

  @derive {Jason.Encoder, except: [:pids]}
  defstruct uuid: "",
            status: :waiting,
            turn: 0,
            settings: %Settings{},
            game: %Game{},
            pids: %{}

  @spec joinable?(Lobby.t(), String.t()) :: boolean()
  def joinable?(state, user_uuid) do
    Map.has_key?(state.pids, user_uuid) || Enum.count(state.pids) < @pids
  end

  @spec stale?(Lobby.t()) :: boolean()
  def stale?(state) do
    Enum.empty?(state.pids)
  end

  @spec startable?(Lobby.t()) :: boolean()
  def startable?(state) do
    state.status != :playing && Enum.count(state.pids) == @pids
  end

  @spec turn?(Lobby.t(), pid()) :: boolean()
  def turn?(state, pid) do
    %{uuid: uuid} = Game.Turn.get_player(state.game)

    Map.get(state.pids, uuid) == pid
  end

  @spec turn(Lobby.t(), pid()) :: integer()
  def turn(state, pid) do
    state.game.players
    |> Enum.find({0, nil}, fn {_index, player} -> Map.get(state.pids, player.uuid) == pid end)
    |> elem(0)
  end

  @spec join(Lobby.t(), String.t(), pid()) :: Lobby.t()
  def join(state, user_uuid, pid) do
    %{state | pids: Map.put(state.pids, user_uuid, pid)}
  end

  @spec leave(Lobby.t(), pid()) :: Lobby.t()
  def leave(state, leaving_pid) do
    pids =
      state.pids
      |> Enum.reject(fn {_uuid, pid} -> pid == leaving_pid end)
      |> Enum.into(%{})

    %{state | pids: pids}
  end

  @spec start(Lobby.t()) :: Lobby.t()
  def start(state) do
    %{state | status: :playing, game: Game.start(Map.keys(state.pids), state.settings)}
  end

  @spec notify_pids(Lobby.t()) :: :ok
  def notify_pids(state) do
    state.pids
    |> Enum.map(fn {_uuid, pid} ->
      Process.send(pid, state, [])
    end)

    :ok
  end
end
