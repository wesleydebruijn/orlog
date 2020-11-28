defmodule BaldrsInvurnerability do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "Baldr's Invurnerability favor" do
    game = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
          dices: %{
            1 => %Dice{
              face: Game.Dice.Face.MeleeBlock.get()
            },
            2 => %Dice{
              face: Game.Dice.Face.MeleeBlock.get()
            }
          }
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk"
        }
      },
      turn: 1
    }

    actual = Favor.BaldrsInvurnerability.invoke(game, %{defence: 1})

    expected = %Game{
      turn: 1,
      players: %{
        1 => %Game.Player{
          user: "FortuinelijkeHenk",
          dices: %{
            2 => %Game.Dice{
              face: %Game.Dice.Face{
                disabled: false,
                stance: :block,
                type: :melee,
                amount: 2
              }
            },
            1 => %Game.Dice{
              face: %Game.Dice.Face{
                stance: :block,
                type: :melee,
                amount: 2
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
