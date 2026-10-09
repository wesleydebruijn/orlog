defmodule Game.Phase.RollTest do
  use ExUnit.Case

  alias Game.{
    Phase,
    Player,
    Dice
  }

  describe "action/2" do
    test "start phase adds the extra dices of Freyja's Plenty" do
      game = %Game{
        players: %{
          1 => %Player{extra_dices: 2, dices: %{1 => %Dice{keep: true, locked: true}}},
          2 => %Player{dices: %{1 => %Dice{}}}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.Roll.action(game, :start_phase)

      assert actual.players[1].extra_dices == 0
      assert actual.players[1].turns == 3

      assert actual.players[1].dices == %{
               1 => %Dice{},
               2 => %Dice{extra: true},
               3 => %Dice{extra: true}
             }

      assert actual.players[2].dices == %{1 => %Dice{}}
    end

    test "swap dice when already rolled" do
      game = %Game{
        players: %{
          1 => %Player{
            rolled: true,
            dices: %{
              1 => %Dice{},
              2 => %Dice{}
            }
          }
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, {:toggle, 2})

      expected = %Game{
        players: %{
          1 => %Player{
            rolled: true,
            dices: %{
              1 => %Dice{},
              2 => %Dice{keep: true}
            }
          }
        },
        turn: 1
      }

      assert actual == expected
    end

    test "swap dice when not rolled" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{},
              2 => %Dice{}
            }
          }
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, {:toggle, 2})

      expected = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{},
              2 => %Dice{}
            }
          }
        },
        turn: 1
      }

      assert actual == expected
    end

    test "continue when not rolled" do
      game = %Game{
        players: %{
          1 => %Player{
            turns: 3,
            dices: %{
              1 => %Dice{},
              2 => %Dice{}
            }
          }
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, :continue)

      assert %Game{
               players: %{
                 1 => %Player{
                   dices: %{
                     1 => %Dice{},
                     2 => %Dice{}
                   },
                   rolled: true
                 }
               },
               turn: 1
             } = actual
    end

    test "continue when already rolled" do
      game = %Game{
        players: %{
          1 => %Player{
            turns: 3,
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack},
              2 => %Dice{face: Dice.Face.MeleeAttack}
            },
            rolled: true
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, :continue)

      expected = %Game{
        players: %{
          1 => %Player{
            turns: 3,
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack},
              2 => %Dice{face: Dice.Face.MeleeAttack}
            },
            rolled: true
          },
          2 => %Player{}
        },
        turn: 2
      }

      assert actual == expected
    end

    test "continue when no rollable dices" do
      game = %Game{
        players: %{
          1 => %Player{
            turns: 3,
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack, locked: true},
              2 => %Dice{face: Dice.Face.MeleeAttack, locked: true}
            },
            rolled: false
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, :continue)

      expected = %Game{
        players: %{
          1 => %Player{
            turns: 3,
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack, locked: true},
              2 => %Dice{face: Dice.Face.MeleeAttack, locked: true}
            },
            rolled: false
          },
          2 => %Player{}
        },
        turn: 2
      }

      assert actual == expected
    end

    test "continue when last turn" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack},
              2 => %Dice{face: Dice.Face.MeleeAttack}
            },
            rolled: true,
            turns: 1
          }
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, :continue)

      assert %Game{
               players: %{
                 1 => %Player{
                   dices: %{
                     1 => %Dice{},
                     2 => %Dice{}
                   },
                   rolled: true,
                   turns: 1
                 }
               },
               turn: 1
             } = actual
    end

    test "end turn when turns left" do
      game = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack},
              2 => %Dice{face: Dice.Face.MeleeAttack, keep: true}
            },
            rolled: true,
            turns: 2
          }
        },
        turn: 1
      }

      actual = Phase.Roll.action(game, :end_turn)

      expected = %Game{
        players: %{
          1 => %Player{
            dices: %{
              1 => %Dice{face: Dice.Face.MeleeAttack},
              2 => %Dice{face: Dice.Face.MeleeAttack, keep: true, locked: true}
            },
            rolled: false,
            turns: 1
          }
        },
        turn: 1
      }

      assert actual == expected
    end

    test "unknown action" do
      actual = Phase.Roll.action(%Game{}, :unknown)
      expected = %Game{}

      assert actual == expected
    end
  end
end
