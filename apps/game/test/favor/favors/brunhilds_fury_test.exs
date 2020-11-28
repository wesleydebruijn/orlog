defmodule BrunhildsFuryTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "Brunhilds Fury favor" do
    game = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
          dices: %{
            1 => %Dice{
              face: Game.Dice.Face.MeleeAttack.get()
            },
            2 => %Dice{
              face: Game.Dice.Face.MeleeAttack.get()
            },
            3 => %Dice{
              face: Game.Dice.Face.RangedAttack.get()
            }
          }
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk"
        }
      },
      turn: 1
    }

    actual = Favor.BrunhildsFury.invoke(game, %{melee_multiplier: 1.5})

    expected = %Game{
      turn: 1,
      players: %{
        1 => %Game.Player{
          user: "FortuinelijkeHenk",
          dices: %{
            3 => %Game.Dice{
              face: %Game.Dice.Face{
                amount: 1,
                stance: :attack,
                type: :ranged
              }
            },
            2 => %Game.Dice{
              face: %Game.Dice.Face{
                amount: 1.5,
                stance: :attack,
                type: :melee
              }
            },
            1 => %Game.Dice{
              face: %Game.Dice.Face{
                stance: :attack,
                type: :melee,
                amount: 1.5
              }
            }
          }
        },
        2 => %Game.Player{
          user: "OnfortuinelijkeHenk"
        }
      }
    }

    assert actual == expected
  end
end
