defmodule Game.Phase.ResolutionTest do
  use ExUnit.Case

  alias Game.{
    Dice,
    Player,
    Phase
  }

  describe "action/2" do
    test "start phase" do
      game = %Game{
        players: %{
          1 => %Player{turns: 0},
          2 => %Player{turns: 0}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.Resolution.action(game, :start_phase)

      expected = %Game{
        players: %{
          1 => %Player{turns: 3},
          2 => %Player{turns: 3}
        },
        phase: 1,
        turn: 1
      }

      assert actual == expected
    end

    test "end phase when both players have health" do
      game = %Game{
        players: %{
          1 => %Player{turns: 0, health: 13},
          2 => %Player{turns: 0, health: 1}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.Resolution.action(game, :end_phase)

      expected = %Game{
        players: %{
          1 => %Player{turns: 0, health: 13},
          2 => %Player{turns: 0, health: 1}
        },
        phase: 1,
        turn: 1
      }

      assert actual == expected
    end

    test "end phase when single player has no health" do
      game = %Game{
        players: %{
          1 => %Player{turns: 0, health: 13},
          2 => %Player{turns: 0, health: 0}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.Resolution.action(game, :end_phase)

      expected = %Game{
        players: %{
          1 => %Player{turns: 0, health: 13},
          2 => %Player{turns: 0, health: 0}
        },
        winner: 1,
        phase: 1,
        turn: 1
      }

      assert actual == expected
    end

    test "end phase when no players have health" do
      game = %Game{
        players: %{
          1 => %Player{turns: 0, health: 0},
          2 => %Player{turns: 0, health: 0}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.Resolution.action(game, :end_phase)

      expected = %Game{
        players: %{
          1 => %Player{turns: 0, health: 0},
          2 => %Player{turns: 0, health: 0}
        },
        winner: 2,
        phase: 1,
        turn: 1
      }

      assert actual == expected
    end

    test "end phase removes the extra dices" do
      game = %Game{
        players: %{
          1 => %Player{
            health: 13,
            dices: %{1 => %Dice{}, 2 => %Dice{extra: true}, 3 => %Dice{extra: true}}
          },
          2 => %Player{health: 5, dices: %{1 => %Dice{}}}
        },
        phase: 1,
        turn: 1
      }

      actual = Phase.Resolution.action(game, :end_phase)

      assert actual.players[1].dices == %{1 => %Dice{}}
      assert actual.players[2].dices == %{1 => %Dice{}}
    end

    test "unknown action" do
      actual = Phase.Resolution.action(%Game{}, :unknown)
      expected = %Game{}

      assert actual == expected
    end
  end
end
