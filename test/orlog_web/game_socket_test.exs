defmodule OrlogWeb.GameSocketTest do
  use ExUnit.Case, async: false

  alias OrlogWeb.GameSocket

  setup do
    {:ok, game: "game-#{System.unique_integer([:positive])}"}
  end

  defp decode({:push, {:text, json}, _state}), do: Jason.decode!(json)

  test "joining a fresh lobby pushes its state to the player", %{game: game} do
    {:push, {:text, _json}, state} = result = GameSocket.init({game, "user-a-#{game}"})
    lobby = decode(result)

    assert state.joined
    assert lobby["status"] == "creating"
    assert lobby["uuid"] == game
    assert lobby["user"]["name"]
    assert [%{"name" => _}] = lobby["users"]
    refute Map.has_key?(lobby, "pids")
  end

  test "changeSettings moves the lobby to waiting", %{game: game} do
    {:push, _, state} = GameSocket.init({game, "user-a-#{game}"})

    message = Jason.encode!(%{type: "changeSettings", value: %{health: 20, dices: 4}})
    lobby = decode(GameSocket.handle_in({message, [opcode: :text]}, state))

    assert lobby["status"] == "waiting"
    assert lobby["settings"]["health"] == 20
    assert lobby["settings"]["dices"] == 4
  end

  test "invalid json and unknown messages return the current state", %{game: game} do
    {:push, _, state} = GameSocket.init({game, "user-a-#{game}"})

    assert decode(GameSocket.handle_in({"not json", [opcode: :text]}, state))["uuid"] == game

    unknown = Jason.encode!(%{type: "nope"})
    assert decode(GameSocket.handle_in({unknown, [opcode: :text]}, state))["uuid"] == game
  end

  test "broadcast lobby states are pushed to the player", %{game: game} do
    {:push, _, state} = GameSocket.init({game, "user-a-#{game}"})
    {:ok, pid} = Game.Lobby.Supervisor.find_or_initialize(game)

    lobby = decode(GameSocket.handle_info(Game.Lobby.Server.state(pid), state))
    assert lobby["uuid"] == game
    assert GameSocket.handle_info(:something_else, state) == {:ok, state}
  end

  test "a third player is turned away from a full lobby", %{game: game} do
    {:push, _, _} = GameSocket.init({game, "user-a-#{game}"})

    # Second player joins from its own process, like a real socket would
    task =
      Task.async(fn ->
        send(self(), :joined)
        GameSocket.init({game, "user-b-#{game}"})
        Process.sleep(500)
      end)

    Process.sleep(100)

    assert {:stop, :normal, {1000, "Lobby is full"}, %{joined: false}} =
             GameSocket.init({game, "user-c-#{game}"})

    Task.shutdown(task, :brutal_kill)
  end

  test "terminate only leaves the lobby when the player joined", %{game: game} do
    assert GameSocket.terminate(:normal, %{game_uuid: game, joined: false}) == :ok

    {:push, _, state} = GameSocket.init({game, "user-a-#{game}"})
    assert GameSocket.terminate(:normal, state) == :ok
  end
end
