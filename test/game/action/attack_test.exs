defmodule Game.Action.AttackTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Action,
    Dice,
    Dice.Face
  }

  describe "attack_health/1" do
    test "when opponent has sufficient health" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{health: 10}
        },
        turn: 1
      }

      actual = Action.Attack.attack_health(game)

      expected = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{health: 5}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when opponent has no sufficient health" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{health: 4}
        },
        turn: 1
      }

      actual = Action.Attack.attack_health(game)

      expected = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{health: 0}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when no attack dices" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{health: 10}
        },
        turn: 1
      }

      actual = Action.Attack.attack_health(game)

      expected = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{health: 10}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "rounds fractional damage up" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1.5}},
              2 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1.5}},
              3 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1.5}},
              4 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 1.5, intersects: 1}}
            }
          },
          2 => %Player{health: 10}
        },
        turn: 1
      }

      actual = Action.Attack.attack_health(game)

      # 3 * 1.5 = 4.5 damage, the blocked die deals nothing
      assert actual.players[2].health == 5
    end

    test "when flat amount" do
      game = %Game{
        players: %{
          1 => %Player{health: 10},
          2 => %Player{health: 10}
        },
        turn: 1
      }

      actual = Action.Attack.attack_health(game, 5)

      expected = %Game{
        players: %{
          1 => %Player{health: 10},
          2 => %Player{health: 5}
        },
        turn: 1
      }

      assert actual == expected
    end
  end

  test "multiply_ranged_attack/1" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :block, type: :melee}},
            5 => %Dice{face: %Face{stance: :attack, type: :ranged}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Attack.multiply_ranged_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :block, type: :melee}},
            5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "multiply_melee_attack/1" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :block, type: :melee}},
            5 => %Dice{face: %Face{stance: :attack, type: :ranged}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Attack.multiply_melee_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 2}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :block, type: :melee}},
            5 => %Dice{face: %Face{stance: :attack, type: :ranged}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "increase_ranged_attack/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :block, type: :ranged}},
            4 => %Dice{face: %Face{stance: :attack, type: :ranged}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Attack.increase_ranged_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 3}},
            3 => %Dice{face: %Face{stance: :block, type: :ranged}},
            4 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 3}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "multiply_attack/1" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :block, type: :melee}},
            5 => %Dice{face: %Face{stance: :attack, type: :ranged}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    actual = Action.Attack.multiply_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee, amount: 2}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :block, type: :melee}},
            5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}}
          }
        },
        2 => %Player{}
      },
      turn: 1
    }

    assert actual == expected
  end
end
