defmodule Game.Dice.Face.TokenStealTest do
  use ExUnit.Case

  alias Game.Dice.Face

  test "get/1" do
    actual = Face.TokenSteal.get()
    expected = %Face{
      type: :token,
      stance: :steal
    }

    assert actual == expected
  end
end
