defmodule Api.Websocket do
  @behaviour :cowboy_websocket

  require Logger

  def init(request, _state) do
    parts = String.split(request.path, "/")
    uuid = Enum.at(parts, 2)
    user_uuid = Enum.at(parts, 3)

    {:cowboy_websocket, request, {%Game.Lobby{uuid: uuid}, user_uuid}}
  end

  def websocket_init({state, user_uuid}) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.uuid)

    if Game.Lobby.Server.joinable?(pid, state.uuid) do
      new_state = Game.Lobby.Server.join(pid, user_uuid)

      {:ok, encode!(new_state)}
    else
      {:reply, {:close, 1000, "Lobby is full"}, state}
    end
  end

  def websocket_handle({:text, json}, state) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.uuid)

    state =
      case Jason.decode!(json) do
        %{"type" => "continue"} -> Game.Lobby.Server.action(pid, :continue)
        _other -> state
      end

    {:reply, {:text, encode!(state)}, state}
  end

  def websocket_info(%Game.Lobby{} = new_state, _state) do
    {:reply, {:text, encode!(new_state)}, new_state}
  end

  def websocket_info(other, state) do
    {:reply, {:text, other}, state}
  end

  def terminate(_reason, _req, state) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.uuid)
    Game.Lobby.Server.leave(pid)
  end

  defp encode!(state) do
    state
    |> Map.put(:turn, Game.Lobby.turn(state, self()))
    |> Jason.encode!()
  end
end
