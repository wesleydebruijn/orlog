defmodule Orlog do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Phoenix.PubSub, name: Orlog.PubSub},
      User.Store,
      Game.Lobby.Supervisor,
      OrlogWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: Orlog.Application]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    OrlogWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
