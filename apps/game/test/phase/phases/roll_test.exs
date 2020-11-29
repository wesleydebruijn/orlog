defmodule Game.Phase.RollTest do
  use ExUnit.Case

  alias Game.{
    Phase,
    Player,
    Dice
  }

  describe "action/2" do
    test "swap dice" do
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

      actual = Phase.Roll.action(game, {:swap, 2})

      expected = %Game{
        players: %{
          1 => %Player{
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
          }
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
          }
        },
        turn: 1
      }

      assert actual == expected
    end

    test "continue when last turn" do
      game = %Game{
        players: %{
          1 => %Player{
            turns: 1,
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
            rolled: true,
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
