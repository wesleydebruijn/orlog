defmodule Game.Action.DiceTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Action,
    Dice,
    Dice.Face
  }

  test "add_extra_dices/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}}
          }
        },
        2 => %Player{health: 10}
      },
      turn: 1
    }

    actual = Action.Dice.add_extra_dices(game, 3)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{},
            5 => %Dice{},
            6 => %Dice{}
          }
        },
        2 => %Player{health: 10}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "reroll_dices/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee, disabled: true}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged, count: 3}},
            3 => %Dice{face: %Face{stance: :steal, type: :token, count: 2}}
          }
        },
        2 => %Player{health: 10}
      },
      turn: 2
    }

    dices = [
      %Dice{face: %Face{stance: :attack, type: :melee, disabled: true}},
      %Dice{face: %Face{stance: :attack, type: :ranged, count: 3}},
      %Dice{face: %Face{stance: :steal, type: :token, count: 2}}
    ]

    actual =
      game
      |> Action.Dice.reroll_dices(2)
      |> Map.get(:players)
      |> Map.get(1)
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> Enum.member?(dices, dice) end)
      |> Enum.count()

    expected = 1

    assert actual == expected
  end

  test "disable_dices/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged, count: 3}},
            3 => %Dice{face: %Face{stance: :steal, type: :token, count: 2}}
          }
        },
        2 => %Player{health: 10}
      },
      turn: 2
    }

    actual =
      game
      |> Action.Dice.disable_dices(2)
      |> Map.get(:players)
      |> Map.get(1)
      |> Map.get(:dices)
      |> IndexMap.filter(fn dice -> dice.face.disabled end)
      |> Enum.count()

    expected = 2

    assert actual == expected
  end

  test "increase_majority/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :attack, type: :ranged}}
          }
        },
        2 => %Player{health: 10}
      },
      turn: 1
    }

    actual = Action.Dice.increase_majority(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{face: %Face{stance: :attack, type: :melee}},
            2 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 3}},
            3 => %Dice{face: %Face{stance: :steal, type: :token}},
            4 => %Dice{face: %Face{stance: :attack, type: :ranged, amount: 3}}
          }
        },
        2 => %Player{health: 10}
      },
      turn: 1
    }

    assert actual == expected
  end
end
