defmodule Game.Lobby.Server do
  @moduledoc """
  Game lobby server where players can join and play a game
  """
  use GenServer

  @spec start_link([String.t(), ...]) :: {:ok, pid()}
  def start_link([uuid]) do
    case GenServer.start_link(__MODULE__, %Game.Lobby{uuid: uuid}, name: to_name(uuid)) do
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

  @spec join(pid(), String.t()) :: Game.Lobby.t()
  def join(pid, user_uuid) do
    GenServer.call(pid, {:join, user_uuid, self()})
  end

  @spec leave(pid()) :: :ok
  def leave(pid) do
    GenServer.cast(pid, {:leave, self()})
  end

  @impl true
  @spec init(any) :: {:ok, Lobby.t()}
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_call({:joinable?, user_uuid}, _from, state) do
    {:reply, Game.Lobby.joinable?(state, user_uuid), state}
  end

  @impl true
  def handle_call({:join, user_uuid, pid}, _from, state) do
    notify_pids(pid)

    # todo: when @pids are met, start the game

    new_state = Game.Lobby.join(state, user_uuid, pid)

    {:reply, new_state, new_state}
  end

  @impl true
  def handle_cast({:leave, pid}, state) do
    new_state = Game.Lobby.leave(state, pid)

    if Game.Lobby.stale?(new_state) do
      schedule_terminate()
    end

    {:noreply, new_state}
  end

  @impl true
  def handle_info({:notify_pids, pid}, state) do
    {:noreply, Game.Lobby.notify_pids(state, pid)}
  end

  def handle_info(:terminate, state) do
    if Game.Lobby.stale?(state) do
      {:stop, :normal, state}
    else
      {:noreply, state}
    end
  end

  defp notify_pids(pid) do
    Process.send(self(), {:notify_pids, pid}, [])
  end

  defp schedule_terminate do
    Process.send_after(self(), :terminate, 1_000)
  end

  defp to_name(uuid), do: String.to_atom(uuid)
end
