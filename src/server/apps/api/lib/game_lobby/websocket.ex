defmodule Api.GameLobby.Websocket do
  @moduledoc """
  Websocket connection of the player
  """
  @behaviour :cowboy_websocket

  alias Api.GameLobby

  require Logger

  @type t :: %GameLobby.Websocket{
          game_uuid: String.t(),
          user_uuid: String.t()
        }
  defstruct game_uuid: nil, game_pid: nil, user_uuid: nil

  def init(request, _state) do
    {:cowboy_websocket, request, state_from_path(request.path)}
  end

  def websocket_init(state) do
    {:ok, pid} = GameLobby.Supervisor.find_or_initialize(state.game_uuid)

    if GameLobby.Server.joinable?(pid, state.user_uuid) do
      GameLobby.Server.join(pid, state.user_uuid)

      {:ok, %{state | game_pid: pid}}
    else
      {:reply, {:close, 1000, "Lobby is full"}, state}
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

  @spec state_from_path(String.t()) :: GameLobby.Websocket.t()
  def state_from_path(path) do
    parts = String.split(path, "/")

    %GameLobby.Websocket{
      game_uuid: Enum.at(parts, 2),
      user_uuid: Enum.at(parts, 3)
    }
  end
end
