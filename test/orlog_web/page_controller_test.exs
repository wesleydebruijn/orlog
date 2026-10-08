defmodule OrlogWeb.PageControllerTest do
  use ExUnit.Case, async: true
  import Phoenix.ConnTest

  @endpoint OrlogWeb.Endpoint

  test "GET / renders the landing page" do
    conn = get(build_conn(), "/")
    assert html_response(conn, 200) =~ "New game"
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
