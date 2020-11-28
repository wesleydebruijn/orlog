defmodule HeimdallsWatchTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "Heimdall's Watch favor" do
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

    actual = Favor.HeimdallsWatch.invoke(game, %{block_heal: 1})

    expected = %Game{
      turn: 1,
      players: %{
        1 => %Game.Player{
          user: "FortuinelijkeHenk",
          dices: %{
            2 => %Game.Dice{
              face: %Game.Dice.Face{
                health: 1,
                stance: :block,
                type: :melee
              }
            },
            1 => %Game.Dice{
              face: %Game.Dice.Face{
                health: 1,
                stance: :block,
                type: :melee
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