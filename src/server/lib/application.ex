defmodule Orlog do
  use Application

  @spec start(any, any) :: {:error, any} | {:ok, pid}
  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Api.Router,
        options: [dispatch: dispatch()]
      ),
      User.Store,
      Game.Lobby.Supervisor
    ]

    opts = [strategy: :one_for_one, name: Orlog.Application]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws/[...]", Api.Websocket, []},
         {:_, Plug.Cowboy.Handler, {Api.Router, []}}
       ]}
    ]
  end
end
