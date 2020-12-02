defmodule Game.DiceTest do
  use ExUnit.Case

  alias Game.Dice

  describe "roll!/1" do
    test "when dice is not kept" do
      dice = %Dice{}
      actual = Enum.map(0..10, fn _x -> Dice.roll!(dice) end)

      assert Enum.any?(actual, fn x -> x != dice end)
    end

    test "when dice is kept" do
      expected = %Dice{tokens: 3}
      actual = Dice.roll!(%Dice{tokens: 3})

      refute actual == expected
    end
  end

  describe "roll/1" do
    test "when dice is not kept" do
      dice = %Dice{}
      actual = Enum.map(0..10, fn _x -> Dice.roll(dice) end)

      assert Enum.any?(actual, fn x -> x != dice end)
    end

    test "when dice is kept" do
      expected = %Dice{keep: true}
      actual = Dice.roll(%Dice{keep: true})

      assert actual == expected
    end
  end

  describe "swap/1" do
    test "when dice is not kept" do
      actual = Dice.swap(%Dice{keep: false})

      assert %Dice{keep: true} = actual
    end

    test "when dice is kept" do
      actual = Dice.swap(%Dice{keep: true})

      assert %Dice{keep: false} = actual
    end

    test "when dice is locked" do
      actual = Dice.swap(%Dice{locked: true, keep: true})
      assert %Dice{locked: true, keep: true} = actual
    end
  end

  describe "lock/1" do
    test "when dice is kept" do
      actual = Dice.lock(%Dice{keep: true, locked: false})
      assert %Dice{keep: true, locked: true} = actual
    end

    test "when dice is not hold" do
      actual = Dice.lock(%Dice{locked: false})
      assert %Dice{locked: false} = actual
    end
  end

  test "unlock/1" do
    actual = Dice.unlock(%Dice{locked: true})

    assert %Dice{locked: false} = actual
  end

  test "keep/1" do
    actual = Dice.keep(%Dice{keep: false})

    assert %Dice{keep: true} = actual
  end

  describe "stance?/2" do
    test "when stance matches" do
      assert Dice.stance?(%Dice{face: %Dice.Face{stance: :block}}, :block)
    end

    test "when stance doesnt match" do
      refute Dice.stance?(%Dice{face: %Dice.Face{stance: :block}}, :attack)
    end
  end

  describe "type?/2" do
    test "when type matches" do
      assert Dice.type?(%Dice{face: %Dice.Face{type: :melee}}, :melee)
    end

    test "when type doesnt match" do
      refute Dice.type?(%Dice{face: %Dice.Face{type: :melee}}, :ranged)
    end
  end

  test "resolve/2" do
    dices = %{
      1 => %Dice{face: %Dice.Face{stance: :attack, type: :melee}},
      2 => %Dice{face: %Dice.Face{stance: :block, type: :ranged}}
    }

    other_dices = %{
      1 => %Dice{face: %Dice.Face{stance: :block, type: :melee}},
      2 => %Dice{face: %Dice.Face{stance: :attack, type: :ranged}}
    }

    actual = Dice.resolve(dices, other_dices)

    expected = %{
      1 => %Dice{face: %Dice.Face{stance: :attack, type: :melee, intersects: 1}},
      2 => %Dice{face: %Dice.Face{stance: :block, type: :ranged, intersects: 1}}
    }

    assert actual == expected
  end
end
