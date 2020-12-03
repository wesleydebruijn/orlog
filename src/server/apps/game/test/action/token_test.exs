defmodule Game.Action.TokenTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Action,
    Dice,
    Dice.Face
  }

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

      actual = Action.Token.steal_tokens(game)

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

      actual = Action.Token.steal_tokens(game)

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

      actual = Action.Token.steal_tokens(game)

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

      actual = Action.Token.steal_tokens(game)

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

    actual = Action.Token.collect_tokens(game)

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

  test "tokens_on_damage/2" do
    game = %Game{
      players: %{
        1 => %Player{},
        2 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}},
            2 => %Dice{face: %Face{stance: :attack, type: :melee}},
            3 => %Dice{face: %Face{stance: :block, type: :ranged}}
          }
        }
      },
      turn: 1
    }

    actual = Action.Token.tokens_on_damage(game, 3)

    expected = %Game{
      players: %{
        1 => %Player{tokens: 9},
        2 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}},
            2 => %Dice{face: %Face{stance: :attack, type: :melee}},
            3 => %Dice{face: %Face{stance: :block, type: :ranged}}
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "destroy_tokens_on_ranged_attack/2" do
    game = %Game{
      players: %{
        1 => %Player{tokens: 6},
        2 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :block, type: :ranged}}
          }
        }
      },
      turn: 2
    }

    actual = Action.Token.destroy_tokens_on_ranged_attack(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{tokens: 2},
        2 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 2}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :block, type: :ranged}}
          }
        }
      },
      turn: 2
    }

    assert actual == expected
  end

  test "decrease_favor_tier/2" do
    game = %Game{
      players: %{
        1 => %Player{},
        2 => %Player{favor_tier: {1, 2}}
      },
      turn: 1
    }

    actual = Action.Token.decrease_favor_tier(game, 3)

    expected = %Game{
      players: %{
        1 => %Player{},
        2 => %Player{favor_tier: {1, -1}}
      },
      turn: 1
    }

    assert actual == expected
  end
end
