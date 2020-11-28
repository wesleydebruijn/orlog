defmodule Game.Player do
  @moduledoc """
  Player
  """
  alias Game.{
    Player,
    Dice
  }

  @type t :: %Player{
    user: String.t(),
    health: integer(),
    tokens: integer(),
    dices: [Game.Dice.t()],
    turn: boolean()
  }
  defstruct user: nil, health: 0, tokens: 0, dices: [], turn: false

  @spec new(String.t()) :: Player.t()
  def new(user) do
    %Player{user: user}
  end

  @spec add_health(Game.Player.t(), number) :: Player.t()
  def add_health(player, amount) do
    %{player | health: player.health + amount}
  end

  @spec add_tokens(Player.t(), number) :: Player.t()
  def add_tokens(player, amount) do
    %{player | tokens: player.tokens + amount}
  end

  @spec add_dices(Player.t(), number) :: Player.t()
  def add_dices(player, amount) do
    %{player | dices: Enum.map(1..amount, fn _x -> %Dice{} end)}
  end

  @spec assign_turn([Player.t()]) :: [Player.t()]
  def assign_turn(players) do
    max_index = Enum.count(players) - 1
    random_index = Enum.random(0..max_index)
    {_player, current_index} = players
      |> Enum.with_index()
      |> Enum.find({nil, random_index}, fn {player, _index} -> player.turn end)

    new_index = if current_index == max_index, do: 0, else: current_index + 1

    players
    |> Enum.with_index()
    |> Enum.map(fn {player, index} ->
      %{player | turn: index == new_index}
    end)
  end
end
