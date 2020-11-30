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
          turns: integer(),
          rolled: boolean(),
          dices: %{}
        }
  defstruct user: nil, health: 0, tokens: 0, dices: %{}, turns: 0, rolled: false

  @spec create([String.t()]) :: map()
  def create(users) do
    users
    |> Enum.with_index(1)
    |> Enum.into(%{}, fn {user, index} -> {index, %Player{user: user}} end)
  end

  @spec update(Player.t(), map()) :: Player.t()
  def update(player, attrs) do
    Map.merge(player, attrs)
  end

  @spec update_health(Player.t(), integer()) :: Player.t()
  def update_health(player, amount) do
    %{player | health: player.health + amount}
  end

  @spec update_tokens(Player.t(), integer()) :: Player.t()
  def update_tokens(player, amount) do
    %{player | tokens: player.tokens + amount}
  end

  @spec update_turns(Player.t(), integer()) :: Player.t()
  def update_turns(player, amount) do
    %{player | turns: player.turns + amount}
  end

  @spec collect_tokens(Player.t()) :: Player.t()
  def collect_tokens(player) do
    tokens =
      player.dices
      |> Enum.map(fn {_index, dice} -> dice.tokens end)
      |> Enum.sum()

    player
    |> update_tokens(tokens)
  end

  @spec set_dices(Player.t(), integer()) :: Player.t()
  def set_dices(player, amount) do
    %{player | dices: Enum.into(1..amount, %{}, fn index -> {index, %Dice{}} end)}
  end

  @spec get_dice(Player.t(), integer()) :: Dice.t()
  def get_dice(player, index) do
    Map.get(player.dices, index)
  end

  @spec update_dices(Player.t(), fun()) :: Player.t()
  def update_dices(player, fun) do
    dices =
      player.dices
      |> Enum.into(%{}, fn {index, dice} -> {index, fun.(dice)} end)

    %{player | dices: dices}
  end

  @spec update_dice(Player.t(), integer(), fun()) :: Player.t()
  def update_dice(player, index, fun) do
    dice =
      player.dices
      |> Map.get(index)
      |> fun.()

    %{player | dices: Map.put(player.dices, index, dice)}
  end

  @spec resolve(Player.t(), Player.t()) :: Player.t()
  def resolve(player, other) do
    %{player | dices: Dice.resolve(player.dices, other.dices)}
  end
end
