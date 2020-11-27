defmodule Game.Player do
  @moduledoc """
  Player
  """
  @max_health 25

  @type t :: %Game.Player{
    health: integer(),
    tokens: integer()
  }
  defstruct health: @max_health, tokens: 0

  @spec add_health(Game.Player.t(), number) :: Game.Player.t()
  def add_health(player, amount) do
    %Game.Player{player | health: player.health + amount}
  end

  @spec add_tokens(Game.Player.t(), number) :: Game.Player.t()
  def add_tokens(player, amount) do
    %Game.Player{player | tokens: player.tokens + amount}
  end
end
