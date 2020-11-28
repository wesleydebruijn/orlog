defmodule Game.Player do
  @moduledoc """
  Player
  """
  alias Game.{
    Settings,
    Player,
    Dice
  }

  @type t :: %Player{
          user: String.t(),
          health: integer(),
          tokens: integer(),
          dices: [Dice.t()]
        }
  defstruct user: nil, health: 0, tokens: 0, dices: []

  @spec new(String.t(), Settings.t()) :: Player.t()
  def new(user, settings) do
    %Player{user: user}
    |> update_health(settings.health)
    |> update_tokens(settings.tokens)
    |> add_dices(settings.dices)
  end

  @spec update_health(Game.Player.t(), number) :: Player.t()
  def update_health(player, amount) do
    %{player | health: player.health + amount}
  end

  @spec update_tokens(Player.t(), number) :: Player.t()
  def update_tokens(player, amount) do
    %{player | tokens: player.tokens + amount}
  end

  @spec add_dices(Player.t(), number) :: Player.t()
  def add_dices(player, amount) do
    %{player | dices: Enum.map(1..amount, fn _x -> %Dice{} end)}
  end
end
