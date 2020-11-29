defmodule Game.Dice.Face.RangedBlockTest do
  use ExUnit.Case

  alias Game.Dice.Face

  test "get/1" do
    actual = Face.RangedBlock.get()

    expected = %Face{
      type: :ranged,
      stance: :block
    }

    assert actual == expected
  end
end
