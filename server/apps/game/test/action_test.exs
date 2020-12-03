defmodule Game.ActionTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Action,
    Dice,
    Dice.Face
  }

  test "collect_tokens/1" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{tokens: 1},
            2 => %Dice{tokens: 1, face: %Face{disabled: true}}
          },
          tokens: 0
        }
      },
      turn: 1
    }

    actual = Action.collect_tokens(game)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{tokens: 1},
            2 => %Dice{tokens: 1, face: %Face{disabled: true}}
          },
          tokens: 1
        }
      },
      turn: 1
    }

    assert actual == expected
  end

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

      actual = Action.attack_health(game)

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

      actual = Action.attack_health(game)

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

      actual = Action.attack_health(game)

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
  end

  describe "steal_tokens/1" do
    test "when opponent has sufficient tokens to steal" do
      game = %Game{
        players: %{
          1 => %Player{
            tokens: 0,
            dices: %{
              1 => %Dice{face: %Face{stance: :steal, type: :token, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, disabled: true}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 10}
        },
        turn: 1
      }

      actual = Action.steal_tokens(game)

      expected = %Game{
        players: %{
          1 => %Player{
            tokens: 4,
            dices: %{
              1 => %Dice{face: %Face{stance: :steal, type: :token, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, disabled: true}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 6}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when opponent has not sufficient tokens to steal" do
      game = %Game{
        players: %{
          1 => %Player{
            tokens: 0,
            dices: %{
              1 => %Dice{face: %Face{stance: :steal, type: :token, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, disabled: true}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 2}
        },
        turn: 1
      }

      actual = Action.steal_tokens(game)

      expected = %Game{
        players: %{
          1 => %Player{
            tokens: 2,
            dices: %{
              1 => %Dice{face: %Face{stance: :steal, type: :token, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, disabled: true}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 0}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when opponent has no tokens" do
      game = %Game{
        players: %{
          1 => %Player{
            tokens: 0,
            dices: %{
              1 => %Dice{face: %Face{stance: :steal, type: :token, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, disabled: true}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 0}
        },
        turn: 1
      }

      actual = Action.steal_tokens(game)

      expected = %Game{
        players: %{
          1 => %Player{
            tokens: 0,
            dices: %{
              1 => %Dice{face: %Face{stance: :steal, type: :token, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :steal, type: :token, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :steal, type: :token, disabled: true}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 0}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when no token steal dices" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 10}
        },
        turn: 1
      }

      actual = Action.steal_tokens(game)

      expected = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 2}},
              2 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 2, count: 1}},
              3 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2, count: 1}},
              4 => %Dice{face: %Face{stance: :block, type: :melee, amount: 1, count: 1}},
              5 => %Dice{face: %Face{stance: :block, type: :ranged, amount: 1, count: 1}}
            }
          },
          2 => %Player{tokens: 10}
        },
        turn: 1
      }

      assert actual == expected
    end
  end
end
