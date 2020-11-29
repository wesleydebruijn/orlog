defmodule Game.Dice.Face.MeleeAttackTest do
  use ExUnit.Case

  alias Game.Dice.Face

  test "get/1" do
    actual = Face.MeleeAttack.get()

    expected = %Face{
      type: :melee,
      stance: :attack
    }

    assert actual == expected
  end
end
