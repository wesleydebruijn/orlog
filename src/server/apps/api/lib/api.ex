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
      Registry.child_spec(
        keys: :duplicate,
        name: Registry.Api
      )
    ]

    opts = [strategy: :one_for_one, name: Api.Application]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws/[...]", Api.SocketHandler, []},
         {:_, Plug.Cowboy.Handler, {Api.Router, []}}
       ]}
    ]
  end
end
