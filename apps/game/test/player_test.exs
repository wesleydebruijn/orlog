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
      dices: %{1 => %Dice{}, 2 => %Dice{}}
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

  test "set_turns/2" do
    actual = Player.set_turns(%Player{}, 2)
    expected = %Player{turns: 2}

    assert actual == expected
  end

  test "set_dices/2" do
    actual = Player.set_dices(%Player{}, 2)
    expected = %Player{dices: %{1 => %Dice{}, 2 => %Dice{}}}

    assert actual == expected
  end

  test "get_dice/2" do
    player = %Player{dices: %{1 => %Dice{}}}

    actual = Player.get_dice(player, 1)
    expected = %Dice{}

    assert actual == expected
  end

  test "update_dice/2" do
    player = %Player{dices: %{1 => %Dice{}}}
    fun = fn dice -> %{dice | keep: true} end

    actual = Player.update_dice(player, 1, fun)
    expected = %Player{dices: %{1 => %Dice{keep: true}}}

    assert actual == expected
  end
end
