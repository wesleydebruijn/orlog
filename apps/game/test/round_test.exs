defmodule Game.RoundTest do
  use ExUnit.Case

  alias Game.Round

  test "determine_next/1" do
    game = %Game{round: 1}

    actual = Round.determine_next(game)
    expected = 2

    assert actual == expected
  end
end
