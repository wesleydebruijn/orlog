defmodule Api.Websocket do
  @behaviour :cowboy_websocket

  require Logger

  def init(request, _state) do
    parts = String.split(request.path, "/")
    game_uuid = Enum.at(parts, 2)
    user_uuid = Enum.at(parts, 3)

    {:cowboy_websocket, request, {game_uuid, user_uuid}}
  end

  def websocket_init({game_uuid, user_uuid}) do
    {:ok, user} = User.Store.find_or_initialize(user_uuid)
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(game_uuid)

    if Game.Lobby.Server.joinable?(pid, user) do
      new_state = Game.Lobby.Server.join(pid, user)

      {:ok, encode!(new_state)}
    else
      {:reply, {:close, 1000, "Lobby is full"}, %Game{}}
    end
  end

  def websocket_handle({:text, json}, state) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.uuid)

    state =
      case Jason.decode!(json) do
        %{"type" => "continue"} ->
          Game.Lobby.Server.action(pid, :continue)

        %{"type" => "toggleDice", "value" => index} ->
          Game.Lobby.Server.action(pid, {:toggle, index})

        %{"type" => "selectFavor", "value" => %{"favor" => favor, "tier" => tier}} ->
          Game.Lobby.Server.action(pid, {:select, %{favor: favor, tier: tier}})

        %{"type" => "changeSettings", "value" => settings} ->
          Game.Lobby.Server.change_settings(pid, settings)

        %{"type" => "setFavors", "value" => settings} ->
          Game.Lobby.Server.set_favors(pid, settings)

        _other ->
          state
      end

    {:reply, {:text, encode!(state)}, state}
  end

  @spec websocket_info(any, any) :: {:reply, {:text, any}, any}
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
