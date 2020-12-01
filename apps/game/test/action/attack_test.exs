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
  end
end
