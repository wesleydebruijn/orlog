defmodule Game.Player do
  @moduledoc """
  Player of a game
  """
  alias Game.{
    Player,
    Dice
  }

  @favors Application.get_env(:game, :favors)

  @type t :: %Player{
          user: String.t(),
          health: integer(),
          tokens: integer(),
          turns: integer(),
          rolled: boolean(),
          favors: map(),
          favor_tier: {integer(), integer()},
          dices: %{}
        }
  defstruct user: nil,
            health: 0,
            tokens: 0,
            dices: %{},
            turns: 0,
            rolled: false,
            favors: %{},
            favor_tier: {0, 0}

  @spec update(Player.t(), map()) :: Player.t()
  def update(player, attrs), do: Map.merge(player, attrs)

  @spec increase(Player.t(), atom(), integer()) :: Player.t()
  def increase(player, key, amount) do
    player
    |> Map.put(key, Map.get(player, key) + amount)
  end

  @spec get_favor(Player.t()) :: map()
  def get_favor(player), do: get_favor(player, player.favor_tier)

  @spec get_favor(Player.t(), {integer(), integer()}) :: map()
  def get_favor(player, favor_tier) do
    {favor_index, tier_index} = favor_tier
    favor = Map.get(@favors, Map.get(player.favors, favor_index, 0), %{})

    %{
      favor: favor,
      tier: Map.get(Map.get(favor, :tiers, %{}), tier_index, %{})
    }
  end

  @spec sufficient_tokens?(Player.t(), integer()) :: boolean()
  def sufficient_tokens?(player, amount), do: player.tokens >= amount

  @spec resolve(Player.t(), Player.t()) :: Player.t()
  def resolve(player, opponent) do
    opponent =
      opponent
      |> IndexMap.update_all(:dices, &Dice.Face.update(&1, %{intersects: 0}))

    %{player | dices: Dice.resolve(player.dices, opponent.dices)}
  end
end
