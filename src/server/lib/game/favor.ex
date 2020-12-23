defmodule Game.Favor do
  @moduledoc """
  Favor
  """
  alias Game.{
    Favor,
    Turn,
    Player
  }

  @type t :: %Favor{
          name: String.t(),
          affects: :player | :opponent | :any,
          trigger: :pre_resolution | :post_resolution | :pre_favor | :post_favor,
          invoke: fun(),
          tiers: %{
            1 => %{cost: number(), value: number()},
            2 => %{cost: number(), value: number()},
            3 => %{cost: number(), value: number()}
          }
        }
  @derive Jason.Encoder
  defstruct name: nil, affects: :any, trigger: :pre_resolution, invoke: nil, tiers: %{}

  @spec invoke?(Favor.t(), atom(), atom()) :: boolean()
  def invoke?(favor, trigger, affects) do
    Map.get(favor, :trigger) == trigger && Map.get(favor, :affects) == affects
  end

  @spec invoke(Game.t()) :: Game.t()
  def invoke(game) do
    player = Turn.get_player(game)
    %{favor: favor, tier: tier} = Player.get_favor(player)

    invoke = Map.get(favor, :invoke)
    value = Map.get(tier, :value)

    if invoke && value do
      game
      |> invoke.(value)
      |> Turn.update_player(&Player.update(&1, %{invoked_favor: player.favor_tier.favor}))
    else
      game
    end
  end

  @spec invoke(Game.t(), atom(), atom()) :: Game.t()
  def invoke(game, trigger, affects) do
    player = Turn.get_player(game)
    %{favor: favor, tier: tier} = Player.get_favor(player)

    if invoke?(favor, trigger, affects) && Player.sufficient_tokens?(player, Map.get(tier, :cost)) do
      game
      |> Turn.update_player(&Player.increase(&1, :tokens, -Map.get(tier, :cost)))
      |> Turn.opponent(&invoke(&1, :pre_favor, :any))
      |> invoke()
      |> Turn.opponent(&invoke(&1, :post_favor, :any))
    else
      game
    end
  end
end
