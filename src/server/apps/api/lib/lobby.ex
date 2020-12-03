defmodule Api.GameLobby do
  use GenServer

  def start_link(_args) do
    GenServer.start_link(__MODULE__, %{})
  end

  def action(pid, action) do
    GenServer.call(pid, action)
  end

  def init(_state) do
    init_state = Game.start(["Wesley", "Jeffrey"])

    {:ok, init_state}
  end

  def handle_call(action, _from, state) do
    new_state = Game.invoke(state, action)

    {:reply, nil, new_state}
  end
end
