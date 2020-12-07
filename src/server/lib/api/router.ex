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
    send_resp(
      conn,
      200,
      Jason.encode!(%{
        name: "RandomViking9001",
        avatar: "https://avatarfiles.alphacoders.com/261/thumb-1920-261090.jpg",
        level: 1,
        title: "Drang"
      })
    )
  end

  get "api/news" do
    send_resp(
      conn,
      200,
      Jason.encode!([
        %{
          title: "Welcome to Orlog",
          content:
            "Orlog, the Viking game from Assassin's Creed Valhalla is now available on the web!",
          author: "Sigurd Styrbjornson",
          timestamp: "12/07/2020 at 11:13"
        },
        %{
          title: "Patch Notes v1.0.3",
          content:
            "We've made it so Jeffrey always wins, no matter what. This is very important since it sets
          a statement. It's just the way it should be and will ever be.",
          author: "Basim Ibn Ishaq",
          timestamp: "14/07/2020 at 14:24"
        }
      ])
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
