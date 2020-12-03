defmodule VidarsMightTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "Vidars Might favor" do
    game = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk"
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk",
          dices: %{
            1 => %Dice{
              face: Game.Dice.Face.MeleeBlock.get()
            },
            2 => %Dice{
              face: Game.Dice.Face.MeleeBlock.get()
            }
          }
        }
      },
      turn: 1
    }

    actual = Favor.VidarsMight.invoke(game, %{melee_bypass: 1})

    expected = %Game{
      turn: 1,
      players: %{
        1 => %Game.Player{
          user: "FortuinelijkeHenk"
        },
        2 => %Game.Player{
          user: "OnfortuinelijkeHenk",
          dices: %{
            2 => %Game.Dice{
              face: %Game.Dice.Face{
                disabled: false,
                stance: :block,
                type: :melee
              }
            },
            1 => %Game.Dice{
              face: %Game.Dice.Face{
                stance: :block,
                type: :melee,
                disabled: true
              }
            }
          }
        }
      }
    }

    assert actual == expected
  end
end
