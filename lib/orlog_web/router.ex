defmodule OrlogWeb.Router do
  use OrlogWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :put_root_layout, html: {OrlogWeb.Layouts, :root}
    plug :put_secure_browser_headers
  end

  scope "/", OrlogWeb do
    pipe_through :browser

    get "/", PageController, :home
    get "/game/:id", PageController, :game
  end

  # Game websocket, speaks the Game.Lobby JSON protocol
  scope "/ws", OrlogWeb do
    get "/:game_id/:user_id", SocketController, :connect
  end
end
