defmodule Api do
  use Application

  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: Api.Router,
        options: [
          dispatch: dispatch(),
          port: 4000
        ]
      ),
      Api.GameLobby.Supervisor
    ]

    opts = [strategy: :one_for_one, name: Api.Application]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws/[...]", Api.GameLobby.Websocket, []},
         {:_, Plug.Cowboy.Handler, {Api.Router, []}}
       ]}
    ]
  end
end
