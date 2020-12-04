defmodule Api.Websocket do
  @moduledoc """
  Websocket connection of the user
  """
  @behaviour :cowboy_websocket

  def init(request, _state) do
    parts = String.split(request.path, "/")
    uuid = Enum.at(parts, 2)
    user_uuid = Enum.at(parts, 3)

    {:cowboy_websocket, request, {%Game.Lobby{uuid: uuid}, user_uuid}}
  end

  def websocket_init({state, user_uuid}) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.uuid)

    if Game.Lobby.Server.joinable?(pid, state.uuid) do
      state = Game.Lobby.Server.join(pid, user_uuid)

      {:ok, state}
    else
      {:reply, {:close, 1000, "Lobby is full"}, %{}}
    end
  end

  def websocket_handle({:text, json}, state) do
    payload = Jason.decode!(json)
    message = payload["data"]["message"]

    {:reply, {:text, message}, state}
  end

  def websocket_info(info, state) do
    {:reply, {:text, info}, state}
  end

  def terminate(_reason, _req, state) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.uuid)
    Game.Lobby.Server.leave(pid)
  end
end
