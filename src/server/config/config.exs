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

config :orlog,
  favors: %{
    1 => %{
      name: "Thors's Strike",
      description: "Deals damage after resolution phase",
      tier_description: "Deal {value} damage",
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
      name: "Baldr's Invulnerability",
      description: "Double each melee and range block dice",
      tier_description: "Increase block by {value}",
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
      description: "Multiplies each melee attack dice",
      tier_description: "Multiply attack by {value}",
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
      description: "Roll additional dices",
      tier_description: "Add {value} dice",
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
      description: "Reroll opponents dices",
      tier_description: "Reroll {value} dice",
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
      description: "Heal for each attack blocked",
      tier_description: "Heal {value} per block",
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
      description: "Heal for each melee attack hit taken",
      tier_description: "Heal {value} per hit",
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
      description: "Heal before resolution phase",
      tier_description: "Heal for {value}",
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
      description: "Ban opponent dices",
      tier_description: "Ban {value} dice",
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
      description: "Gain tokens per damage dealt",
      tier_description: "Gain {value} tokens",
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
      description: "Heal before resolution phase",
      tier_description: "Heal for {value}",
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
      description: "Multiplies each ranged attack dice",
      tier_description: "Multiply attack by {value}",
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
      description: "Destroy opponents tokens",
      tier_description: "Destroy {value} tokens",
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
      description: "Ignore opponents ranged block dice",
      tier_description: "Ignore {value} dice",
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
      description: "Heal for each token opponent spent",
      tier_description: "Heal {value} per token",
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
      description: "Ignore opponents melee block dice",
      tier_description: "Ignore {value} dice",
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
      description: "Decrease opponents God Favor",
      tier_description: "Decrease tier by -{value}",
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
