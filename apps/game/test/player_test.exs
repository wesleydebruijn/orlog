defmodule Game.PlayerTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice
  }

  test "new/1" do
    actual = Player.new("Wesley")
    expected = %Player{user: "Wesley"}

    assert actual == expected
  end

  describe "add_health/2" do
    test "when health is added" do
      actual = Player.add_health(%Player{}, 2)
      expected = %Player{health: 2}

      assert actual == expected
    end

    test "when health is substracted" do
      actual = Player.add_health(%Player{}, -2)
      expected = %Player{health: -2}

      assert actual == expected
    end
  end

  describe "add_tokens/2" do
    test "when tokens are added" do
      actual = Player.add_tokens(%Player{}, 2)
      expected = %Player{tokens: 2}

      assert actual == expected
    end

    test "when tokens are substracted" do
      actual = Player.add_tokens(%Player{}, -2)
      expected = %Player{tokens: -2}

      assert actual == expected
    end
  end

  test "add_dices/2" do
    actual = Player.add_dices(%Player{}, 2)
    expected = %Player{dices: [%Dice{}, %Dice{}]}

    assert actual == expected
  end

  describe "assign_turn/1" do
    test "when no players are assigned" do
      players = [
        %Player{turn: false},
        %Player{turn: false}
      ]

      actual = Player.assign_turn(players)

      assert Enum.any?(actual, & &1.turn)
    end

    test "when player is assigned" do
      players = [
        %Player{turn: true},
        %Player{turn: false}
      ]

      actual = Player.assign_turn(players)
      expected = [
        %Player{turn: false},
        %Player{turn: true}
      ]

      assert actual == expected
    end

    test "when last player is assigned" do
      players = [
        %Player{turn: false},
        %Player{turn: true}
      ]

      actual = Player.assign_turn(players)
      expected = [
        %Player{turn: true},
        %Player{turn: false}
      ]

      assert actual == expected
    end
  end
end
