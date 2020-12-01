defmodule Game.Player do
  @moduledoc """
  Player of a game
  """
  alias Game.{
    Player,
    Dice
  }

  @type t :: %Player{
          user: String.t(),
          health: integer(),
          health_regen: integer(),
          tokens: integer(),
          turns: integer(),
          rolled: boolean(),
          dices: %{}
        }
  defstruct user: nil, health: 0, health_regen: 0, tokens: 0, dices: %{}, turns: 0, rolled: false

  @spec update(Player.t(), map()) :: Player.t()
  def update(player, attrs), do: Map.merge(player, attrs)

  @spec increase(Player.t(), atom(), integer()) :: Player.t()
  def increase(player, key, amount) do
    player
    |> Map.put(key, Map.get(player, key) + amount)
  end

  @spec resolve(Player.t(), Player.t()) :: Player.t()
  def resolve(player, opponent) do
    opponent =
      opponent
      |> IndexMap.update_all(:dices, &Dice.Face.update(&1, %{intersects: 0}))

    %{player | dices: Dice.resolve(player.dices, opponent.dices)}
  end
end
