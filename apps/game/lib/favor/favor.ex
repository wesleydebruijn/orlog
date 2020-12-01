defmodule Game.Favor do
  @moduledoc """
  Favor
  """
  alias Game.{
    Favor,
    Action,
    Turn,
    Player
  }

  @type t :: %Favor{
          name: String.t(),
          affects: :player | :opponent,
          trigger: :pre_resolution | :resolution | :post_resolution,
          invoke: fun(),
          tiers: %{
            1 => %{cost: number(), value: number()},
            2 => %{cost: number(), value: number()},
            3 => %{cost: number(), value: number()}
          }
        }

  defstruct name: nil, affects: :player, trigger: :pre_resolution, invoke: nil, tiers: %{}

  def all do
    %{
      1 => %Favor{
        name: "Thorss Strike",
        affects: :player,
        trigger: :post_resolution,
        invoke: &Action.Attack.attack_health/2,
        tiers: %{
          1 => %{cost: 4, value: 2},
          2 => %{cost: 8, value: 5},
          3 => %{cost: 12, value: 8}
        }
      },
      2 => %Favor{
        name: "Baldr's Invurnerability",
        affects: :player,
        trigger: :pre_resolution,
        invoke: &Action.Block.increase_block/2,
        tiers: %{
          1 => %{cost: 3, value: 1},
          2 => %{cost: 6, value: 2},
          3 => %{cost: 9, value: 3}
        }
      },
      3 => %Favor{
        name: "Brunhild's Fury",
        affects: :player,
        trigger: :pre_resolution,
        invoke: &Action.Attack.multiply_attack/2,
        tiers: %{
          1 => %{cost: 6, value: 1.5},
          2 => %{cost: 10, value: 2},
          3 => %{cost: 18, value: 3}
        }
      },
      4 => %Favor{
        name: "Freyja's Plenty",
        affects: :player,
        trigger: :post_resolution,
        invoke: &Action.Dice.add_extra_dices/2,
        tiers: %{
          1 => %{cost: 2, value: 1},
          2 => %{cost: 4, value: 2},
          3 => %{cost: 6, value: 3}
        }
      },
      5 => %Favor{
        name: "Frigg's Sight",
        affects: :opponent,
        trigger: :pre_resolution,
        invoke: &Action.Dice.reroll_dices/2,
        tiers: %{
          1 => %{cost: 2, value: 2},
          2 => %{cost: 3, value: 3},
          3 => %{cost: 4, value: 4}
        }
      },
      6 => %Favor{
        name: "Heimdall's Watch",
        affects: :player,
        trigger: :post_resolution,
        invoke: &Action.Heal.heal_on_block/2,
        tiers: %{
          1 => %{cost: 4, value: 1},
          2 => %{cost: 7, value: 2},
          3 => %{cost: 10, value: 3}
        }
      },
      7 => %Favor{
        name: "Hel's Grip",
        affects: :player,
        trigger: :post_resolution,
        invoke: &Action.Heal.heal_on_melee_attack/2,
        tiers: %{
          1 => %{cost: 6, value: 1},
          2 => %{cost: 12, value: 2},
          3 => %{cost: 18, value: 3}
        }
      },
      8 => %Favor{
        name: "Idun's Rejuvenation",
        affects: :player,
        trigger: :pre_resolution,
        invoke: &Action.Heal.heal/2,
        tiers: %{
          1 => %{cost: 4, value: 2},
          2 => %{cost: 7, value: 4},
          3 => %{cost: 10, value: 6}
        }
      },
      9 => %Favor{
        name: "Loki's Trick",
        affects: :opponent,
        trigger: :pre_resolution,
        invoke: &Action.Dice.disable_dices/2,
        tiers: %{
          1 => %{cost: 3, value: 1},
          2 => %{cost: 6, value: 2},
          3 => %{cost: 9, value: 3}
        }
      },
      10 => %Favor{
        name: "Mimir's Wisdom",
        affects: :player,
        invoke: &Action.Token.tokens_on_damage/2,
        trigger: :post_resolution,
        tiers: %{
          1 => %{cost: 4, value: 2},
          2 => %{cost: 8, value: 5},
          3 => %{cost: 12, value: 8}
        }
      },
      11 => %Favor{
        name: "Odin's Sacrifice",
        affects: :player,
        invoke: &Action.Heal.heal/2,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 6, value: 3},
          2 => %{cost: 8, value: 4},
          3 => %{cost: 10, value: 5}
        }
      },
      12 => %Favor{
        # Adds ranged damage to your ranged damage dice. +1, +2, +3 for a cost of 6, 10, and 14.
        name: "Skadi's Hunt",
        affects: :player,
        invoke: fn game, _value -> game end,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 6, value: 1},
          2 => %{cost: 10, value: 2},
          3 => %{cost: 14, value: 3}
        }
      },
      13 => %Favor{
        # Destroy an opponents God Favor for each arrow dice played. -2, -3, -4 per die for 4,6, and 8 cost.
        name: "Skuld's Claim",
        affects: :opponent,
        invoke: fn game, _value -> game end,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 4, value: 2},
          2 => %{cost: 6, value: 3},
          3 => %{cost: 8, value: 4}
        }
      },
      14 => %Favor{
        name: "Ullr's Aim",
        affects: :opponent,
        invoke: &Action.Block.bypass_block/2,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 2, value: 2},
          2 => %{cost: 3, value: 3},
          3 => %{cost: 6, value: 6}
        }
      },
      15 => %Favor{
        # Vars Bond heals you for +1, +2, and +3 for each favor spent by your opponent for a cost of 10, 14, and 18.
        name: "Var's Bond",
        affects: :player,
        invoke: fn game, _value -> game end,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 10, value: 1},
          2 => %{cost: 14, value: 2},
          3 => %{cost: 18, value: 3}
        }
      },
      16 => %Favor{
        name: "Vidar's Might",
        affects: :opponent,
        invoke: &Action.Block.bypass_melee_block/2,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 2, value: 2},
          2 => %{cost: 3, value: 4},
          3 => %{cost: 6, value: 6}
        }
      },
      17 => %Favor{
        # This ability reduces your opponents God Favor skill, if invokved, by -1, -2, and -3 levels for a cost of 3, 6 and 9.
        name: "Thrymr's Theft",
        affects: :opponent,
        invoke: fn game, _value -> game end,
        trigger: :pre_resolution,
        tiers: %{
          1 => %{cost: 3, value: 1},
          2 => %{cost: 6, value: 2},
          3 => %{cost: 9, value: 3}
        }
      }
    }
  end

  @spec select(Game.t(), {integer(), integer()}) :: Game.t()
  def select(game, favor_tier) do
    %{tokens: tokens} = Turn.get_player(game)

    favor_tier
    |> get_tier()
    |> case do
      %{cost: cost} when cost <= tokens ->
        game
        |> Turn.update_player(&Player.update(&1, %{active_favor: favor_tier}))

      _other ->
        game
    end
  end

  @spec invoke(Game.t(), atom(), atom()) :: Game.t()
  def invoke(game, trigger, affects) do
    # todo: use player.favors
    player = Turn.get_player(game)

    if player.active_favor do
      favor = get_favor(player.active_favor)
      tier = get_tier(player.active_favor)

      if favor.trigger == trigger && favor.affects == affects do
        tier
        |> case do
          %{cost: cost} when cost <= player.tokens ->
            game
            |> Turn.update_player(&Player.increase(&1, :tokens, -cost))
            |> favor.invoke.(tier.value)

          _other ->
            game
        end
      else
        game
      end
    else
      game
    end
  end

  defp get_favor({favor, _tier}) do
    all()
    |> Map.get(favor)
  end

  defp get_tier({favor, tier}) do
    all()
    |> Map.get(favor)
    |> Map.get(:tiers)
    |> Map.get(tier)
  end
end
