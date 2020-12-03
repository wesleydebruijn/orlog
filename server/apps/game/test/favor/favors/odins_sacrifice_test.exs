defmodule OdinsSacrificeTest do
  use ExUnit.Case

  alias Game.{
    Player
  }

  test "Odins Sacrifice favor" do
    game = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
          health: 14
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk",
          health: 20
        }
      },
      turn: 1
    }

    actual = Favor.OdinsSacrifice.invoke(game, %{heal: 6})

    expected = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
          health: 20
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk",
          health: 20
        }
      },
      turn: 1
    }

    assert actual == expected
  end
end
