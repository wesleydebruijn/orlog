defmodule Api.Router do
  use Plug.Router

  plug(Plug.Static, at: "/static", from: "build/static")

  plug(:match)

  plug(CORSPlug)

  plug(Plug.Parsers, parsers: [:json], json_decoder: Jason)

  plug(:dispatch)

  get "/api/favors" do
    send_resp(conn, 200, favors())
  end

  get "api/player" do
    send_resp(conn, 200, Jason.encode!(%{name: "RandomViking9001", level: 1, title: "Beginner"}))
  end

  get "api/news" do
    send_resp(
      conn,
      200,
      Jason.encode!(%{
        title: "Welcome to Orlog",
        content:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem beatae possimus recusandae, libero adipisci laborum natus, iusto laboriosam animi odit omnis. Fuga, consequatur facilis. Et pariatur neque similique magni placeat.",
        author: "Sigurd Styrbjornson",
        timestamp: "12/07/2020 at 11:13"
      })
    )
  end

  match _ do
    conn = put_resp_content_type(conn, "text/html")
    send_file(conn, 200, "./build/index.html")
  end

  defp favors do
    Application.get_env(:orlog, :favors)
    |> Enum.into(%{}, fn {index, item} ->
      {index, %{name: item.name, tiers: item.tiers}}
    end)
    |> Jason.encode!()
  end
end
