defmodule User.Store do
  @moduledoc """
  Storage of key-value based users
  """
  use GenServer

  def child_spec(_args) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, []},
      restart: :temporary
    }
  end

  @spec start_link :: :ignore | {:error, any} | {:ok, pid}
  def start_link do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  @spec find_or_initialize(String.t()) :: {:ok, User.t()}
  def find_or_initialize(uuid) do
    case :ets.lookup(:users, uuid) do
      [{_key, user}] ->
        {:ok, user}

      _ ->
        user = User.new(uuid)

        :ets.insert(:users, {uuid, user})

        {:ok, user}
    end
  end

  @spec init(any) :: {:ok, atom | :ets.tid()}
  def init(_args) do
    {:ok, :ets.new(:users, [:set, :public, :named_table])}
  end
end
