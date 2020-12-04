defmodule Game.Lobby do
  @moduledoc """
  Game lobby
  """
  alias Game.{
    Lobby,
    Settings
  }

  @pids 2
  @type t :: %Lobby{
          uuid: String.t(),
          settings: Settings.t(),
          game: Game.t(),
          pids: %{}
        }

  @derive {Jason.Encoder, only: [:uuid, :settings, :game]}
  defstruct uuid: "", settings: %Settings{}, game: %Game{}, pids: %{}

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
    Enum.count(state.pids) == @pids
  end

  @spec turn?(Lobby.t(), pid()) :: boolean()
  def turn?(state, pid) do
    %{uuid: uuid} = Game.Turn.get_player(state.game)

    Map.get(state.pids, uuid) == pid
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
    %{state | game: Game.start(Map.keys(state.pids), state.settings)}
  end

  @spec notify_pids(Lobby.t()) :: :ok
  def notify_pids(state) do
    state.pids
    |> Enum.map(fn {_uuid, pid} ->
      Process.send(pid, Jason.encode!(state), [])
    end)

    :ok
  end
end
