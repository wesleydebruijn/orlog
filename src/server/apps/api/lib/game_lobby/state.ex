defmodule Api.GameLobby.State do
  @moduledoc """
  State of the game lobby
  """
  alias Api.GameLobby.State

  @pids 2

  @type t :: %State{
          settings: Game.Settings.t(),
          game: Game.t(),
          pids: %{}
        }
  defstruct settings: %Game.Settings{}, game: %Game{}, pids: %{}

  @spec joinable?(State.t(), String.t()) :: boolean()
  def joinable?(state, user_uuid) do
    Map.has_key?(state.pids, user_uuid) || Enum.count(state.pids) < @pids
  end

  @spec join(State.t(), String.t(), pid()) :: State.t()
  def join(state, user_uuid, pid) do
    %{state | pids: Map.put(state.pids, user_uuid, pid)}
  end

  @spec notify(State.t()) :: State.t()
  def notify(state) do
    state.pids
    |> Map.values()
    |> Enum.map(fn pid ->
      Process.send(pid, "test", [])
    end)

    state
  end
end
