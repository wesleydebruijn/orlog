defmodule Api.GameLobby.Server do
  @moduledoc """
  Game lobby server where players can join and play a game
  """
  use GenServer

  alias Api.GameLobby

  @spec start_link([String.t(), ...]) :: {:ok, pid()}
  def start_link([uuid]) do
    case GenServer.start_link(__MODULE__, %GameLobby.State{}, name: to_name(uuid)) do
      {:ok, pid} -> {:ok, pid}
      {:error, {:already_started, pid}} -> {:ok, pid}
    end
  end

  @spec exists?(String.t()) :: boolean()
  def exists?(uuid) do
    case GenServer.whereis(to_name(uuid)) do
      nil -> false
      _pid -> true
    end
  end

  @spec joinable?(pid(), String.t()) :: boolean()
  def joinable?(pid, user_uuid) do
    GenServer.call(pid, {:joinable?, user_uuid})
  end

  @spec join(pid(), String.t()) :: :ok
  def join(pid, user_uuid) do
    GenServer.cast(pid, {:join, user_uuid, self()})
  end

  @impl true
  @spec init(any) :: {:ok, GameLobby.State.t()}
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_call({:joinable?, user_uuid}, _from, state) do
    {:reply, GameLobby.State.joinable?(state, user_uuid), state}
  end

  @impl true
  def handle_cast({:join, user_uuid, pid}, state) do
    notify()

    {:noreply, GameLobby.State.join(state, user_uuid, pid)}
  end

  @impl true
  def handle_info(:notify, state) do
    {:noreply, GameLobby.State.notify(state)}
  end

  defp notify do
    Process.send(self(), :notify, [])
  end

  defp to_name(uuid), do: String.to_atom(uuid)
end
