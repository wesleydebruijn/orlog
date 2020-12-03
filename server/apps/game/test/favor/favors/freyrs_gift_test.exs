defmodule FreyrsGift do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "Freyrs Gift favor" do
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
          user: "OnfortuinelijkeHenk",
          dices: %{}
        }
      },
      turn: 1
    }

    actual = Favor.FreyrsGift.invoke(game, %{amount: 2})

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
                amount: 1,
                stance: :attack,
                type: :melee
              }
            },
            1 => %Game.Dice{
              face: %Game.Dice.Face{
                stance: :attack,
                type: :melee,
                amount: 3
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
