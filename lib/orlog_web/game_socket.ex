defmodule OrlogWeb.GameSocket do
  @moduledoc """
  WebSock handler that connects a browser to a `Game.Lobby.Server`.

  Client -> server messages are JSON objects with a `type` (`continue`, `toggleDice`,
  `selectFavor`, `changeSettings`, `toggleReady`, `updateUser`). Server -> client messages
  are always the full `Game.Lobby` state, with `turn` and `user` set for the receiving player.
  """
  @behaviour WebSock

  @impl true
  def init({game_uuid, user_uuid}) do
    {:ok, user} = User.Store.find_or_initialize(user_uuid)
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(game_uuid)

    if Game.Lobby.Server.joinable?(pid, user) do
      lobby = Game.Lobby.Server.join(pid, user)

      {:push, {:text, encode!(lobby)}, %{game_uuid: game_uuid, joined: true}}
    else
      {:stop, :normal, {1000, "Lobby is full"}, %{game_uuid: game_uuid, joined: false}}
    end
  end

  @impl true
  def handle_in({json, [opcode: :text]}, state) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(state.game_uuid)

    lobby =
      case Jason.decode(json) do
        {:ok, message} -> handle_message(pid, message)
        _invalid -> Game.Lobby.Server.state(pid)
      end

    {:push, {:text, encode!(lobby)}, state}
  end

  def handle_in(_other, state), do: {:ok, state}

  @impl true
  def handle_info(%Game.Lobby{} = lobby, state) do
    {:push, {:text, encode!(lobby)}, state}
  end

  def handle_info(_other, state), do: {:ok, state}

  @impl true
  def terminate(_reason, %{joined: true, game_uuid: game_uuid}) do
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(game_uuid)
    Game.Lobby.Server.leave(pid)
    :ok
  end

  def terminate(_reason, _state), do: :ok

  defp handle_message(pid, %{"type" => "continue"}),
    do: Game.Lobby.Server.action(pid, :continue)

  defp handle_message(pid, %{"type" => "toggleDice", "value" => index}),
    do: Game.Lobby.Server.action(pid, {:toggle, index})

  defp handle_message(pid, %{
         "type" => "selectFavor",
         "value" => %{"favor" => favor, "tier" => tier}
       }),
       do: Game.Lobby.Server.action(pid, {:select, %{favor: favor, tier: tier}})

  defp handle_message(pid, %{"type" => "changeSettings", "value" => settings}),
    do: Game.Lobby.Server.change_settings(pid, settings)

  defp handle_message(pid, %{"type" => "toggleReady"}),
    do: Game.Lobby.Server.toggle_ready(pid)

  defp handle_message(pid, %{"type" => "updateUser", "value" => attrs}),
    do: Game.Lobby.Server.update_user(pid, attrs)

  defp handle_message(pid, _other), do: Game.Lobby.Server.state(pid)

  defp encode!(lobby) do
    lobby
    |> Map.put(:turn, Game.Lobby.turn(lobby, self()))
    |> Map.put(:user, Game.Lobby.get_user(lobby, self()))
    |> Jason.encode!()
  end
end
