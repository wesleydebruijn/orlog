defmodule OrlogWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :orlog

  plug Plug.Static,
    at: "/",
    from: :orlog,
    gzip: Mix.env() == :prod,
    only: OrlogWeb.static_paths()

  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Head

  plug OrlogWeb.Router
end
