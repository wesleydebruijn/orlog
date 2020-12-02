defmodule Game.PlayerTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "update/2" do
    actual = Player.update(%Player{}, %{turns: 2})
    expected = %Player{turns: 2}

    assert actual == expected
  end

  describe "increase/2" do
    test "when turns are added" do
      actual = Player.increase(%Player{}, :turns, 2)
      expected = %Player{turns: 2}

      assert actual == expected
    end

    test "when turns are substracted" do
      actual = Player.increase(%Player{}, :turns, -2)
      expected = %Player{turns: -2}

      assert actual == expected
    end
  end

  test "resolve/2" do
    player = %Player{
      dices: %{
        1 => %Dice{face: %Dice.Face{stance: :attack, type: :melee}},
        2 => %Dice{face: %Dice.Face{stance: :block, type: :ranged}}
      }
    }

    other_player = %Player{
      dices: %{
        1 => %Dice{face: %Dice.Face{stance: :block, type: :melee}},
        2 => %Dice{face: %Dice.Face{stance: :attack, type: :ranged}}
      }
    }

    actual = Player.resolve(player, other_player)

    expected = %Player{
      dices: %{
        1 => %Dice{face: %Dice.Face{stance: :attack, type: :melee, intersects: 1}},
        2 => %Dice{face: %Dice.Face{stance: :block, type: :ranged, intersects: 1}}
      }
    }

    assert actual == expected
  end
end
