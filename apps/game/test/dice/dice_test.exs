defmodule Game.DiceTest do
  use ExUnit.Case

  alias Game.Dice

  test "roll/1" do
    dice = Dice.roll()
    actual = Enum.map(0..10, fn _x -> Dice.roll(dice) end)

    assert Enum.any?(actual, fn x -> x != dice end)
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
  end
end
