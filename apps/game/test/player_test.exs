defmodule Game.PlayerTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "new/2" do
    actual = Player.new("Wesley", %{health: 12, tokens: 99, dices: 2})

    expected = %Player{
      user: "Wesley",
      health: 12,
      tokens: 99,
      dices: [%Dice{}, %Dice{}]
    }

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

  test "add_dices/2" do
    actual = Player.add_dices(%Player{}, 2)
    expected = %Player{dices: [%Dice{}, %Dice{}]}

    assert actual == expected
  end
end
