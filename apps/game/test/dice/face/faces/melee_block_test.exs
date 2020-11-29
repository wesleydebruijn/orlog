defmodule Game.Dice.Face.MeleeBlockTest do
  use ExUnit.Case

  alias Game.Dice.Face

  test "get/1" do
    actual = Face.MeleeBlock.get()

    expected = %Face{
      type: :melee,
      stance: :block
    }

    assert actual == expected
  end
end
