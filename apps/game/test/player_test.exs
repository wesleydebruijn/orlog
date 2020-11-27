defmodule Game.PlayerTest do
  use ExUnit.Case

  alias Game.Player

  describe "add_health/2" do
    test "when health is added" do
      actual = Player.add_health(%Player{}, 2)
      expected = %Player{health: 27}

      assert actual == expected
    end

    test "when health is substracted" do
      actual = Player.add_health(%Player{}, -2)
      expected = %Player{health: 23}

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
end
