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

  @spec state(pid()) :: Lobby.t()
  def state(pid) do
    GenServer.call(pid, :state)
  end

  @spec joinable?(pid(), String.t()) :: boolean()
  def joinable?(pid, user_uuid) do
    GenServer.call(pid, {:joinable?, user_uuid})
  end

  @spec join(pid(), String.t()) :: Lobby.t()
  def join(pid, user_uuid) do
    GenServer.call(pid, {:join, user_uuid, self()})
  end

  @spec leave(pid()) :: :ok
  def leave(pid) do
    GenServer.cast(pid, {:leave, self()})
  end

  @spec action(pid(), any()) :: Lobby.t()
  def action(pid, action) do
    GenServer.call(pid, {:action, action, self()})
  end

  @impl true
  @spec init(any) :: {:ok, Lobby.t()}
  def init(state) do
    {:ok, state}
  end

  @impl true
  def handle_call(:state, _from, state) do
    {:reply, state, state}
  end

  @impl true
  def handle_call({:joinable?, user_uuid}, _from, state) do
    {:reply, Game.Lobby.joinable?(state, user_uuid), state}
  end

  @impl true
  def handle_call({:join, user_uuid, pid}, _from, state) do
    notify_pids()

    new_state = Game.Lobby.join(state, user_uuid, pid)

    if Game.Lobby.startable?(new_state) do
      new_state = Game.Lobby.start(new_state)

      {:reply, new_state, new_state}
    else
      {:reply, new_state, new_state}
    end
  end

  @impl true
  def handle_call({:action, action, pid}, _from, state) do
    notify_pids()

    if Game.Lobby.turn?(state, pid) do
      new_state =
        state
        |> Map.put(:game, Game.invoke(state.game, action))
        |> Game.Lobby.update_status()

      {:reply, new_state, new_state}
    else
      {:reply, state, state}
    end
  end

  @impl true
  def handle_cast({:leave, pid}, state) do
    notify_pids()

    new_state = Game.Lobby.leave(state, pid)

    if Game.Lobby.stale?(new_state) do
      schedule_terminate()
    end

    {:noreply, new_state}
  end

  @impl true
  def handle_info(:notify_pids, state) do
    Game.Lobby.notify_pids(state)

    {:noreply, state}
  end

  def handle_info(:terminate, state) do
    if Game.Lobby.stale?(state) do
      {:stop, :normal, state}
    else
      {:noreply, state}
    end
  end

  defp notify_pids do
    Process.send(self(), :notify_pids, [])
  end

  defp schedule_terminate do
    Process.send_after(self(), :terminate, 120_000)
  end

  defp to_name(uuid), do: String.to_atom(uuid)
end
