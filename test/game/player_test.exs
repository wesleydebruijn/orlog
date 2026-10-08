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
      actual = Player.increase(%Player{turns: 1}, :turns, -2)
      expected = %Player{turns: 0}

      assert actual == expected
    end
  end

  describe "get_favor/2" do
    test "with selected favor/tier" do
      player = %Player{
        favors: %{
          1 => 2,
          2 => 5,
          3 => 1
        },
        favor_tier: %{favor: 3, tier: 3}
      }

      actual = Player.get_favor(player)

      expected = %{
        favor: %{
          affects: :any,
          invoke: &Game.FakeAction.invoke/2,
          name: "Fake Favor",
          tiers: %{
            1 => %{cost: 4, value: 1},
            2 => %{cost: 6, value: 2},
            3 => %{cost: 8, value: 3}
          },
          trigger: :pre_favor
        },
        tier: %{cost: 8, value: 3}
      }

      assert actual == expected
    end

    test "with given favor/tier" do
      player = %Player{
        favors: %{
          1 => 2,
          2 => 5,
          3 => 1
        }
      }

      actual = Player.get_favor(player, %{favor: 3, tier: 1})

      expected = %{
        favor: %{
          affects: :any,
          invoke: &Game.FakeAction.invoke/2,
          name: "Fake Favor",
          tiers: %{
            1 => %{cost: 4, value: 1},
            2 => %{cost: 6, value: 2},
            3 => %{cost: 8, value: 3}
          },
          trigger: :pre_favor
        },
        tier: %{cost: 4, value: 1}
      }

      assert actual == expected
    end
  end

  describe "sufficient_tokens?" do
    test "when player has enough tokens" do
      assert Player.sufficient_tokens?(%Player{tokens: 3}, 3)
    end

    test "when player doesnt have enough tokens" do
      refute Player.sufficient_tokens?(%Player{tokens: 3}, 4)
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
