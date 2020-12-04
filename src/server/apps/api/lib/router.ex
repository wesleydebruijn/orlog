defmodule Api.Router do
  use Plug.Router
  require EEx

  plug(Plug.Static, at: "/", from: :api)

  plug(:match)
  plug(:dispatch)

  EEx.function_from_file(:defp, :application_html, "lib/application.html.eex", [])

  get "/game" do
    send_resp(conn, 200, application_html())
  end

  match _ do
    send_resp(conn, 404, "May the Father of Understanding guide us.")
  end
end
