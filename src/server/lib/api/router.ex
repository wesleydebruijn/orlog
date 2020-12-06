defmodule Api.Router do
  use Plug.Router

  plug(Plug.Static, at: "/static", from: "build/static")

  plug(:match)

  plug(CORSPlug)

  plug(Plug.Parsers, parsers: [:json], json_decoder: Jason)

  plug(:dispatch)

  get "/" do
    conn = put_resp_content_type(conn, "text/html")
    send_file(conn, 200, "./build/index.html")
  end

  get "/api/favors" do
    send_resp(conn, 200, favors())
  end

  defp favors do
    Application.get_env(:orlog, :favors)
    |> Enum.into(%{}, fn {index, item} ->
      {index, %{name: item.name, tiers: item.tiers}}
    end)
    |> Jason.encode!()
  end

  match _ do
    send_resp(conn, 404, "May the Father of Understanding guide us.")
  end
end
