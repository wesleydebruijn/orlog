defmodule Game.Dice.Face.RangedAttackTest do
  use ExUnit.Case

  alias Game.Dice.Face

  test "get/1" do
    actual = Face.RangedAttack.get()

    expected = %Face{
      type: :ranged,
      stance: :attack
    }

    assert actual == expected
  end
end
