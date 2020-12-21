defmodule Game.Lobby do
  @moduledoc """
  Game lobby
  """
  alias Game.{
    Lobby,
    Settings
  }

  @pids 2
  @type t :: %Lobby{
          uuid: String.t(),
          turn: integer(),
          status: :creating | :waiting | :playing | :finished,
          settings: Settings.t(),
          game: Game.t(),
          pids: %{},
          users: %{}
        }

  @derive {Jason.Encoder, except: [:pids]}
  defstruct uuid: "",
            status: :creating,
            turn: 0,
            settings: %Settings{},
            game: %Game{},
            pids: %{},
            users: %{}

  @spec joinable?(Lobby.t(), User.t()) :: boolean()
  def joinable?(state, user) do
    Map.has_key?(state.pids, user.uuid) || Enum.count(state.pids) < @pids
  end

  @spec stale?(Lobby.t()) :: boolean()
  def stale?(state) do
    Enum.empty?(state.pids)
  end

  @spec startable?(Lobby.t()) :: boolean()
  def startable?(state) do
    state.status != :playing && Enum.count(state.pids) == @pids &&
      Enum.all?(state.users, fn {_uuid, user} -> user.ready end)
  end

  @spec turn?(Lobby.t(), pid()) :: boolean()
  def turn?(state, pid) do
    %{user: %User{uuid: uuid}} = Game.Turn.get_player(state.game)

    Map.get(state.pids, uuid) == pid
  end

  @spec try_to_start(Lobby.t()) :: Lobby.t()
  def try_to_start(state) do
    if Game.Lobby.startable?(state) do
      Game.Lobby.start(state)
    else
      state
    end
  end

  @spec update_status(Lobby.t()) :: Lobby.t()
  def update_status(%{game: %{winner: 0}} = state), do: state

  def update_status(state) do
    state.pids
    |> Map.values()
    |> Enum.reduce(state, &toggle_ready(&2, &1))
    |> Map.put(:status, :finished)
  end

  @spec toggle_ready(Lobby.t(), pid()) :: Lobby.t()
  def toggle_ready(state, pid) do
    {_key, user} = get_user(state, pid)

    update_user(state, %{"ready" => !user.ready}, pid)
  end

  @spec update_user(Lobby.t(), map(), pid()) :: Lobby.t()
  def update_user(state, attrs, pid) do
    {key, user} = get_user(state, pid)

    updated_user = User.update(user, attrs)
    User.Store.update(updated_user)
    IndexMap.update(state, :users, key, fn _user -> updated_user end)
  end

  @spec update_settings(Lobby.t(), map) :: Lobby.t()
  def update_settings(state, %{}), do: state

  def update_settings(state, settings) do
    new_settings =
      state.settings
      |> Map.put(:health, Map.get(settings, "health"))
      |> Map.put(:dices, Map.get(settings, "dices"))
      |> Map.put(:favors, Map.get(settings, "favors"))
      |> Map.put(:tokens, Map.get(settings, "tokens"))

    %{state | settings: new_settings}
  end

  @spec turn(Lobby.t(), pid()) :: integer()
  def turn(state, pid) do
    state.game.players
    |> Enum.find({0, nil}, fn {_index, player} -> Map.get(state.pids, player.user.uuid) == pid end)
    |> elem(0)
  end

  @spec join(Lobby.t(), User.t(), pid()) :: Lobby.t()
  def join(state, user, pid) do
    %{
      state
      | pids: Map.put(state.pids, user.uuid, pid),
        users: Map.put(state.users, user.uuid, user)
    }
  end

  @spec leave(Lobby.t(), pid()) :: Lobby.t()
  def leave(state, leaving_pid) do
    {uuid, _pid} = Enum.find(state.pids, {"", nil}, fn {_uuid, pid} -> pid == leaving_pid end)

    %{state | pids: Map.delete(state.pids, uuid), users: Map.delete(state.users, uuid)}
  end

  @spec start(Lobby.t()) :: Lobby.t()
  def start(state) do
    %{state | status: :playing, game: Game.start(Map.values(state.users), state.settings)}
  end

  @spec notify_pids(Lobby.t()) :: :ok
  def notify_pids(state) do
    state.pids
    |> Enum.map(fn {_uuid, pid} ->
      Process.send(pid, state, [])
    end)

    :ok
  end

  @spec get_user(Lobby.t(), pid()) :: {String.t(), User.t()}
  defp get_user(state, pid) do
    state.users
    |> Enum.find({0, nil}, fn {_index, user} ->
      Map.get(state.pids, user.uuid) == pid
    end)
  end
end
