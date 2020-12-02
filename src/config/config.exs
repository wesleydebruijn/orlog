# This file is responsible for configuring your umbrella
# and **all applications** and their dependencies with the
# help of the Config module.
#
# Note that all applications in your umbrella share the
# same configuration and dependencies, which is why they
# all use the same configuration file. If you want different
# configurations or dependencies per app, it is best to
# move said applications out of the umbrella.
import Config

config :game,
  favors: %{
    1 => %{
      name: "Thors's Strike",
      affects: :player,
      trigger: :post_resolution,
      invoke: &Game.Action.Attack.attack_health/2,
      tiers: %{
        1 => %{cost: 4, value: 2},
        2 => %{cost: 8, value: 5},
        3 => %{cost: 12, value: 8}
      }
    },
    2 => %{
      name: "Baldr's Invurnerability",
      affects: :player,
      trigger: :pre_resolution,
      invoke: &Game.Action.Block.increase_block/2,
      tiers: %{
        1 => %{cost: 3, value: 1},
        2 => %{cost: 6, value: 2},
        3 => %{cost: 9, value: 3}
      }
    },
    3 => %{
      name: "Brunhild's Fury",
      affects: :player,
      trigger: :pre_resolution,
      invoke: &Game.Action.Attack.multiply_attack/2,
      tiers: %{
        1 => %{cost: 6, value: 1.5},
        2 => %{cost: 10, value: 2},
        3 => %{cost: 18, value: 3}
      }
    },
    4 => %{
      name: "Freyja's Plenty",
      affects: :player,
      trigger: :post_resolution,
      invoke: &Game.Action.Dice.add_extra_dices/2,
      tiers: %{
        1 => %{cost: 2, value: 1},
        2 => %{cost: 4, value: 2},
        3 => %{cost: 6, value: 3}
      }
    },
    5 => %{
      name: "Frigg's Sight",
      affects: :opponent,
      trigger: :pre_resolution,
      invoke: &Game.Action.Dice.reroll_dices/2,
      tiers: %{
        1 => %{cost: 2, value: 2},
        2 => %{cost: 3, value: 3},
        3 => %{cost: 4, value: 4}
      }
    },
    6 => %{
      name: "Heimdall's Watch",
      affects: :player,
      trigger: :post_resolution,
      invoke: &Game.Action.Heal.heal_on_block/2,
      tiers: %{
        1 => %{cost: 4, value: 1},
        2 => %{cost: 7, value: 2},
        3 => %{cost: 10, value: 3}
      }
    },
    7 => %{
      name: "Hel's Grip",
      affects: :player,
      trigger: :post_resolution,
      invoke: &Game.Action.Heal.heal_on_receive_melee_attack/2,
      tiers: %{
        1 => %{cost: 6, value: 1},
        2 => %{cost: 12, value: 2},
        3 => %{cost: 18, value: 3}
      }
    },
    8 => %{
      name: "Idun's Rejuvenation",
      affects: :player,
      trigger: :pre_resolution,
      invoke: &Game.Action.Heal.heal/2,
      tiers: %{
        1 => %{cost: 4, value: 2},
        2 => %{cost: 7, value: 4},
        3 => %{cost: 10, value: 6}
      }
    },
    9 => %{
      name: "Loki's Trick",
      affects: :opponent,
      trigger: :pre_resolution,
      invoke: &Game.Action.Dice.disable_dices/2,
      tiers: %{
        1 => %{cost: 3, value: 1},
        2 => %{cost: 6, value: 2},
        3 => %{cost: 9, value: 3}
      }
    },
    10 => %{
      name: "Mimir's Wisdom",
      affects: :player,
      trigger: :post_resolution,
      invoke: &Game.Action.Token.tokens_on_damage/2,
      tiers: %{
        1 => %{cost: 4, value: 2},
        2 => %{cost: 8, value: 5},
        3 => %{cost: 12, value: 8}
      }
    },
    11 => %{
      name: "Odin's Sacrifice",
      affects: :player,
      trigger: :pre_resolution,
      invoke: &Game.Action.Heal.heal/2,
      tiers: %{
        1 => %{cost: 6, value: 3},
        2 => %{cost: 8, value: 4},
        3 => %{cost: 10, value: 5}
      }
    },
    12 => %{
      name: "Skadi's Hunt",
      affects: :player,
      trigger: :pre_resolution,
      invoke: &Game.Action.Attack.multiply_ranged_attack/2,
      tiers: %{
        1 => %{cost: 6, value: 2},
        2 => %{cost: 10, value: 3},
        3 => %{cost: 14, value: 4}
      }
    },
    13 => %{
      name: "Skuld's Claim",
      affects: :opponent,
      trigger: :pre_resolution,
      invoke: &Game.Action.Token.destroy_tokens_on_ranged_attack/2,
      tiers: %{
        1 => %{cost: 4, value: 2},
        2 => %{cost: 6, value: 3},
        3 => %{cost: 8, value: 4}
      }
    },
    14 => %{
      name: "Ullr's Aim",
      affects: :opponent,
      trigger: :pre_resolution,
      invoke: &Game.Action.Block.bypass_block/2,
      tiers: %{
        1 => %{cost: 2, value: 2},
        2 => %{cost: 3, value: 3},
        3 => %{cost: 6, value: 6}
      }
    },
    15 => %{
      name: "Var's Bond",
      affects: :any,
      trigger: :pre_favor,
      invoke: &Game.Action.Heal.heal_on_tokens_spent/2,
      tiers: %{
        1 => %{cost: 10, value: 1},
        2 => %{cost: 14, value: 2},
        3 => %{cost: 18, value: 3}
      }
    },
    16 => %{
      name: "Vidar's Might",
      affects: :opponent,
      trigger: :pre_resolution,
      invoke: &Game.Action.Block.bypass_melee_block/2,
      tiers: %{
        1 => %{cost: 2, value: 2},
        2 => %{cost: 3, value: 4},
        3 => %{cost: 6, value: 6}
      }
    },
    17 => %{
      name: "Thrymr's Theft",
      affects: :any,
      trigger: :pre_favor,
      invoke: &Game.Action.Token.decrease_favor_tier/2,
      tiers: %{
        1 => %{cost: 3, value: 1},
        2 => %{cost: 6, value: 2},
        3 => %{cost: 9, value: 3}
      }
    }
  }

import_config "#{Mix.env()}.exs"
