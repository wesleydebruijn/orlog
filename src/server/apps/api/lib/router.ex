defmodule Api.Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  match _ do
    send_resp(conn, 404, "May the Father of Understanding guide us.")
  end
end
