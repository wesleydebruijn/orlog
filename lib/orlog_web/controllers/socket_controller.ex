defmodule OrlogWeb.SocketController do
  use OrlogWeb, :controller

  # Ids end up as lobby process names, so only accept short, uuid-like values.
  @id_format ~r/\A[A-Za-z0-9_-]{1,64}\z/

  def connect(conn, %{"game_id" => game_id, "user_id" => user_id}) do
    if Regex.match?(@id_format, game_id) and Regex.match?(@id_format, user_id) do
      conn
      |> WebSockAdapter.upgrade(OrlogWeb.GameSocket, {game_id, user_id}, timeout: :infinity)
      |> halt()
    else
      conn
      |> send_resp(400, "Invalid game or user id")
      |> halt()
    end
  end
end
