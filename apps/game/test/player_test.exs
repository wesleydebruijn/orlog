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

  describe "update_health/2" do
    test "when health is added" do
      actual = Player.update_health(%Player{}, 2)
      expected = %Player{health: 2}

      assert actual == expected
    end

    test "when health is substracted" do
      actual = Player.update_health(%Player{}, -2)
      expected = %Player{health: -2}

      assert actual == expected
    end
  end

  describe "update_tokens/2" do
    test "when tokens are added" do
      actual = Player.update_tokens(%Player{}, 2)
      expected = %Player{tokens: 2}

      assert actual == expected
    end

    test "when tokens are substracted" do
      actual = Player.update_tokens(%Player{}, -2)
      expected = %Player{tokens: -2}

      assert actual == expected
    end
  end

  describe "update_turns/2" do
    test "when turns are added" do
      actual = Player.update_turns(%Player{}, 2)
      expected = %Player{turns: 2}

      assert actual == expected
    end

    test "when turns are substracted" do
      actual = Player.update_turns(%Player{}, -2)
      expected = %Player{turns: -2}

      assert actual == expected
    end
  end

  test "collect_tokens/1" do
    player = %Player{
      dices: %{
        1 => %Dice{tokens: 1},
        2 => %Dice{tokens: 1}
      },
      tokens: 3
    }

    actual = Player.collect_tokens(player)

    expected = %Player{
      dices: %{
        1 => %Dice{tokens: 1},
        2 => %Dice{tokens: 1}
      },
      tokens: 5
    }

    assert actual == expected
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
