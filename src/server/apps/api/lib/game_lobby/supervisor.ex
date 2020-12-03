defmodule Api.GameLobby.Supervisor do
  @moduledoc """
  Supervises all game lobby servers
  """
  use DynamicSupervisor

  @spec start_link(any) :: :ignore | {:error, any} | {:ok, pid}
  def start_link(arg) do
    DynamicSupervisor.start_link(__MODULE__, arg, name: __MODULE__)
  end

  @spec find_or_initialize(String.t()) :: {:ok, pid}
  def find_or_initialize(uuid) do
    spec = {Api.GameLobby.Server, [uuid]}

    DynamicSupervisor.start_child(__MODULE__, spec)
  end

  @impl true
  def init(_arg) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end
end
