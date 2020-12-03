defmodule ThorsStrikeTest do
  use ExUnit.Case

  alias Game.{
    Player
  }

  test "Thors Strike favor" do
    game = %Game{
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

    actual = Favor.ThorsStrike.invoke(game, %{damage: 6})

    expected = %Game{
      players: %{
        1 => %Player{
          user: "FortuinelijkeHenk",
          health: 20
        },
        2 => %Player{
          user: "OnfortuinelijkeHenk",
          health: 14
        }
      },
      turn: 1
    }

    assert actual == expected
  end
end
