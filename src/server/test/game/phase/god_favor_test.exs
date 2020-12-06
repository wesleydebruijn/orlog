defmodule Game.Phase.GodFavorTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Phase
  }

  describe "action/2" do
    test "start phase when first round, skips phase" do
      game = %Game{
        players: %{
          1 => %Player{turns: 0},
          2 => %Player{turns: 0}
        },
        round: 1,
        phase: 1,
        turn: 1
      }

      actual = Phase.GodFavor.action(game, :start_phase)

      expected = %Game{
        players: %{
          1 => %Player{turns: 8},
          2 => %Player{turns: 8}
        },
        round: 1,
        phase: 3,
        turn: 1
      }

      assert actual == expected
    end

    test "start phase" do
      game = %Game{
        players: %{
          1 => %Player{turns: 0},
          2 => %Player{turns: 0}
        },
        round: 2,
        phase: 1,
        turn: 1
      }

      actual = Phase.GodFavor.action(game, :start_phase)

      expected = %Game{
        players: %{
          1 => %Player{turns: 3},
          2 => %Player{turns: 3}
        },
        round: 2,
        phase: 1,
        turn: 1
      }

      assert actual == expected
    end

    test "continue" do
      game = %Game{
        players: %{
          1 => %Player{turns: 3},
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.GodFavor.action(game, :continue)

      expected = %Game{
        players: %{
          1 => %Player{turns: 2},
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 2
      }

      assert actual == expected
    end

    test "select favor when sufficient tokens" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            turns: 3,
            tokens: 6
          },
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.GodFavor.action(game, {:select, %{favor: 1, tier: 2}})

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: %{favor: 1, tier: 2},
            turns: 2,
            tokens: 6
          },
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 2
      }

      assert actual == expected
    end

    test "select favor when insufficient tokens" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            turns: 3,
            tokens: 5
          },
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.GodFavor.action(game, {:select, %{favor: 1, tier: 2}})

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            turns: 3,
            tokens: 5
          },
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 1
      }

      assert actual == expected
    end

    test "end turn when turns left" do
      game = %Game{
        players: %{
          1 => %Player{turns: 3},
          2 => %Player{turns: 3}
        },
        turn: 1
      }

      actual = Phase.GodFavor.action(game, :end_turn)

      expected = %Game{
        players: %{
          1 => %Player{turns: 2},
          2 => %Player{turns: 3}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "unknown action" do
      actual = Phase.GodFavor.action(%Game{}, :unknown)
      expected = %Game{}

      assert actual == expected
    end
  end
end
