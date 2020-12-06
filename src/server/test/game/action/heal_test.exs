defmodule Game.Action.HealTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Action,
    Dice,
    Dice.Face
  }

  test "heal/2" do
    game = %Game{
      players: %{
        1 => %Player{
          health: 10
        }
      },
      turn: 1
    }

    actual = Action.Heal.heal(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          health: 12
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "heal_on_ranged_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          health: 10,
          dices: %{
            1 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, intersects: 1}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Heal.heal_on_ranged_block(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          health: 12,
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :ranged, amount: 1, count: 1, intersects: 1}
            }
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "heal_on_melee_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          health: 10,
          dices: %{
            1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, intersects: 1}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Heal.heal_on_melee_block(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          health: 12,
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :melee, amount: 1, count: 1, intersects: 1}
            }
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "heal_on_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          health: 10,
          dices: %{
            1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, intersects: 1}},
            2 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, intersects: 1}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Heal.heal_on_block(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          health: 14,
          dices: %{
            1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, intersects: 1}},
            2 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, intersects: 1}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "heal_on_receive_ranged_attack/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1, intersects: 0}
            }
          }
        },
        2 => %Player{
          health: 10
        }
      },
      turn: 2
    }

    actual = Action.Heal.heal_on_receive_ranged_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1, intersects: 0}
            }
          }
        },
        2 => %Player{
          health: 12
        }
      },
      turn: 2
    }

    assert actual == expected
  end

  test "heal_on_receive_melee_attack/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee, amount: 1, count: 1, intersects: 0}
            }
          }
        },
        2 => %Player{
          health: 10
        }
      },
      turn: 2
    }

    actual = Action.Heal.heal_on_receive_melee_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee, amount: 1, count: 1, intersects: 0}
            }
          }
        },
        2 => %Player{
          health: 12
        }
      },
      turn: 2
    }

    assert actual == expected
  end

  test "heal_on_receive_attack/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee, amount: 1, count: 1, intersects: 0}
            },
            2 => %Dice{
              face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1, intersects: 0}
            }
          }
        },
        2 => %Player{
          health: 10
        }
      },
      turn: 2
    }

    actual = Action.Heal.heal_on_receive_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee, amount: 1, count: 1, intersects: 0}
            },
            2 => %Dice{
              face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1, intersects: 0}
            }
          }
        },
        2 => %Player{
          health: 14
        }
      },
      turn: 2
    }

    assert actual == expected
  end

  describe "heal_on_tokens_spent/2" do
    test "with active favor" do
      game = %Game{
        players: %{
          1 => %Player{
            health: 10
          },
          2 => %Player{
            favors: %{
              1 => 1
            },
            favor_tier: %{favor: 1, tier: 1}
          }
        },
        turn: 1
      }

      actual = Action.Heal.heal_on_tokens_spent(game, 1)

      expected = %Game{
        players: %{
          1 => %Player{
            health: 14
          },
          2 => %Player{
            favors: %{
              1 => 1
            },
            favor_tier: %{favor: 1, tier: 1}
          }
        },
        turn: 1
      }

      assert actual == expected
    end

    test "without active favor" do
      game = %Game{
        players: %{
          1 => %Player{
            health: 10
          },
          2 => %Player{
            favors: %{
              1 => 1
            }
          }
        },
        turn: 1
      }

      actual = Action.Heal.heal_on_tokens_spent(game, 1)

      expected = %Game{
        players: %{
          1 => %Player{
            health: 10
          },
          2 => %Player{
            favors: %{
              1 => 1
            }
          }
        },
        turn: 1
      }

      assert actual == expected
    end
  end
end
