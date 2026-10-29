defmodule OrlogWeb.PageControllerTest do
  use ExUnit.Case, async: true
  import Phoenix.ConnTest

  @endpoint OrlogWeb.Endpoint

  test "GET / renders the landing page" do
    conn = get(build_conn(), "/")
    html = html_response(conn, 200)

    assert html =~ "New game"
    assert html =~ ~s(aria-label="Orlog")
    assert html =~ ~s(id="home-die")
    assert html =~ ~s(id="home-embers")
    assert html =~ ~s(id="home-backdrop")
    refute html =~ "home.jpg"
  end

  test "serves the self-hosted Cinzel font" do
    conn = get(build_conn(), "/fonts/Cinzel-Variable.woff2")
    assert response(conn, 200)
  end

  test "GET /game/:id embeds the game id and the favor catalogue" do
    conn = get(build_conn(), "/game/abc-123")
    html = html_response(conn, 200)

    assert html =~ ~s(data-game-id="abc-123")
    assert html =~ "data-favors="
    assert html =~ "Fake Favor"
    assert html =~ ~s(id="table")
  end

  test "websocket route rejects malformed ids" do
    conn = get(build_conn(), "/ws/#{String.duplicate("a", 65)}/user")
    assert response(conn, 400)
  end
end
