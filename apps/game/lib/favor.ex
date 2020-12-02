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
          affects: :player | :opponent | :both,
          trigger: :pre_resolution | :post_resolution | :pre_favor | :post_favor,
          invoke: fun(),
          tiers: %{
            1 => %{cost: number(), value: number()},
            2 => %{cost: number(), value: number()},
            3 => %{cost: number(), value: number()}
          }
        }

  defstruct name: nil, affects: :player, trigger: :pre_resolution, invoke: nil, tiers: %{}

  @spec all :: map()
  def all do
    %{
      1 => %Favor{
        name: "Thors's Strike",
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
        trigger: :post_resolution,
        invoke: &Action.Token.tokens_on_damage/2,
        tiers: %{
          1 => %{cost: 4, value: 2},
          2 => %{cost: 8, value: 5},
          3 => %{cost: 12, value: 8}
        }
      },
      11 => %Favor{
        name: "Odin's Sacrifice",
        affects: :player,
        trigger: :pre_resolution,
        invoke: &Action.Heal.heal/2,
        tiers: %{
          1 => %{cost: 6, value: 3},
          2 => %{cost: 8, value: 4},
          3 => %{cost: 10, value: 5}
        }
      },
      12 => %Favor{
        name: "Skadi's Hunt",
        affects: :player,
        trigger: :pre_resolution,
        invoke: &Action.Attack.multiply_ranged_attack/2,
        tiers: %{
          1 => %{cost: 6, value: 2},
          2 => %{cost: 10, value: 3},
          3 => %{cost: 14, value: 4}
        }
      },
      13 => %Favor{
        name: "Skuld's Claim",
        affects: :opponent,
        trigger: :pre_resolution,
        invoke: &Action.Token.destroy_tokens_on_ranged_attack/2,
        tiers: %{
          1 => %{cost: 4, value: 2},
          2 => %{cost: 6, value: 3},
          3 => %{cost: 8, value: 4}
        }
      },
      14 => %Favor{
        name: "Ullr's Aim",
        affects: :opponent,
        trigger: :pre_resolution,
        invoke: &Action.Block.bypass_block/2,
        tiers: %{
          1 => %{cost: 2, value: 2},
          2 => %{cost: 3, value: 3},
          3 => %{cost: 6, value: 6}
        }
      },
      15 => %Favor{
        name: "Var's Bond",
        affects: :both,
        trigger: :post_favor,
        invoke: &Action.Heal.heal_on_tokens_spent/2,
        tiers: %{
          1 => %{cost: 10, value: 1},
          2 => %{cost: 14, value: 2},
          3 => %{cost: 18, value: 3}
        }
      },
      16 => %Favor{
        name: "Vidar's Might",
        affects: :opponent,
        trigger: :pre_resolution,
        invoke: &Action.Block.bypass_melee_block/2,
        tiers: %{
          1 => %{cost: 2, value: 2},
          2 => %{cost: 3, value: 4},
          3 => %{cost: 6, value: 6}
        }
      },
      17 => %Favor{
        name: "Thrymr's Theft",
        affects: :both,
        trigger: :pre_favor,
        invoke: &Action.Token.decrease_favor_tier/2,
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
    player = Turn.get_player(game)
    %{tier: tier} = Player.favor(player, favor_tier)

    if tier && tier.cost <= player.tokens do
      game
      |> Turn.update_player(&Player.update(&1, %{favor_tier: favor_tier}))
    else
      game
    end
  end

  @spec invoke(Game.t(), atom(), atom()) :: Game.t()
  def invoke(game, trigger, affects) do
    player = Turn.get_player(game)
    %{favor: favor, tier: tier} = Player.favor(player)

    if favor && favor.trigger == trigger && favor.affects == affects &&
         tier && tier.cost <= player.tokens do
      game
      |> Turn.update_player(&Player.increase(&1, :tokens, -tier.cost))
      |> Turn.swap(&invoke(&1, :pre_favor, :both))
      |> do_invoke()
      |> Turn.swap(&invoke(&1, :pre_favor, :both))
    else
      game
    end
  end

  @spec do_invoke(Game.t()) :: Game.t()
  defp do_invoke(game) do
    player = Turn.get_player(game)
    %{favor: favor, tier: tier} = Player.favor(player)

    if favor && tier do
      favor.invoke.(game, tier.value)
    else
      game
    end
  end
end
