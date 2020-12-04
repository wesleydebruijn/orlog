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

  @spec joinable?(State.t(), String.t()) :: boolean()
  def joinable?(state, user_uuid) do
    Map.has_key?(state.pids, user_uuid) || Enum.count(state.pids) < @pids
  end

  @spec stale?(State.t()) :: boolean()
  def stale?(state) do
    Enum.empty?(state.pids)
  end

  @spec join(Lobby.t(), String.t(), pid()) :: Lobby.t()
  def join(state, user_uuid, pid) do
    %{state | pids: Map.put(state.pids, user_uuid, pid)}
  end

  @spec leave(State.t(), pid()) :: Lobby.t()
  def leave(state, pid) do
    %{state | pids: without_pid(state.pids, pid)}
  end

  @spec notify_pids(State.t(), pid()) :: Lobby.t()
  def notify_pids(state, sender) do
    state.pids
    |> without_pid(sender)
    |> Enum.map(fn {_uuid, pid} -> Process.send(pid, Jason.encode!(state), []) end)

    state
  end

  defp without_pid(pids, removable_pid) do
    pids
    |> Enum.reject(fn {_uuid, pid} -> pid == removable_pid end)
    |> Enum.into(%{})
  end
end
