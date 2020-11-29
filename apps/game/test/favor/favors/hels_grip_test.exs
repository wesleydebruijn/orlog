defmodule HelsGripTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "Hels Grip favor" do
    game = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk",
         dices: %{
            1 => %Dice{
              face: Dice.Face.MeleeAttack.get()
            },
            2 => %Dice{
              face: Dice.Face.RangedAttack.get()
            }
          }
        }
      },
      turn: 1
    }

    actual = Favor.HelsGrip.invoke(game, %{heal_per_melee: 1})

    expected = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk",
          dices: %{
            1 => %Dice{
              face: %Dice.Face{
                health_opponent: 1,
                stance: :attack
              }
            },
            2 => %Dice{
              face: %Dice.Face{
                health_opponent: 0,
                stance: :attack,
                type: :ranged
              }
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end
end
