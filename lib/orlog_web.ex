defmodule OrlogWeb do
  @moduledoc """
  Entrypoint for the web interface: `use OrlogWeb, :controller` and `use OrlogWeb, :html`.
  """

  def static_paths, do: ~w(assets images favicon.ico robots.txt)

  def router do
    quote do
      use Phoenix.Router, helpers: false

      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def controller do
    quote do
      use Phoenix.Controller, formats: [:html]

      import Plug.Conn

      unquote(verified_routes())
    end
  end

  def html do
    quote do
      use Phoenix.Component

      import Phoenix.Controller, only: [get_csrf_token: 0]

      unquote(verified_routes())
    end
  end

  def verified_routes do
    quote do
      use Phoenix.VerifiedRoutes,
        endpoint: OrlogWeb.Endpoint,
        router: OrlogWeb.Router,
        statics: OrlogWeb.static_paths()
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
