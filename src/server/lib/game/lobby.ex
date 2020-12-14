defmodule Game.Lobby do
  @moduledoc """
  Game lobby
  """
  alias Game.{
    Lobby,
    Settings
  }

  require Logger

  @pids 2
  @type t :: %Lobby{
          uuid: String.t(),
          turn: integer(),
          status: :waiting | :playing | :finished,
          settings: Settings.t(),
          game: Game.t(),
          pids: %{},
          users: %{}
        }

  @derive {Jason.Encoder, except: [:pids, :users]}
  defstruct uuid: "",
            status: :waiting,
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
    state.status != :playing && Enum.count(state.pids) == @pids
  end

  @spec turn?(Lobby.t(), pid()) :: boolean()
  def turn?(state, pid) do
    %{user: %User{uuid: uuid}} = Game.Turn.get_player(state.game)

    Map.get(state.pids, uuid) == pid
  end

  @spec update_status(Lobby.t()) :: Lobby.t()
  def update_status(state) do
    if state.game.winner > 0 do
      %{state | status: :finished}
    else
      state
    end
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
end
