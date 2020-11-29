defmodule Game.TurnTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Settings,
    Turn
  }

  describe "determine_next_turn/1" do
    test "when in bounds" do
      game = %Game{
        players: %{
          1 => %Player{user: "Wesley"},
          2 => %Player{user: "Jeffrey"}
        },
        turn: 1
      }

      actual = Turn.determine_next_turn(game)
      expected = 2

      assert actual == expected
    end

    test "when out of bounds" do
      game = %Game{
        players: %{
          1 => %Player{user: "Wesley"},
          2 => %Player{user: "Jeffrey"}
        },
        turn: 2
      }

      actual = Turn.determine_next_turn(game)
      expected = 1

      assert actual == expected
    end
  end

  describe "next_turn/1" do
    test "when players have turns left" do
      game = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: "Wesley", turns: 3},
          2 => %Player{user: "Jeffrey", turns: 3}
        },
        turn: 1,
        phase: 1
      }

      actual = Turn.next_turn(game)

      expected = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: "Wesley", turns: 2},
          2 => %Player{user: "Jeffrey", turns: 3}
        },
        turn: 2,
        phase: 1
      }

      assert actual == expected
    end

    test "when players have no turns left" do
      game = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: "Wesley", turns: 1},
          2 => %Player{user: "Jeffrey", turns: 0}
        },
        turn: 1,
        phase: 1
      }

      actual = Turn.next_turn(game)

      expected = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: "Wesley", turns: 1},
          2 => %Player{user: "Jeffrey", turns: 1}
        },
        turn: 2,
        phase: 2
      }

      assert actual == expected
    end
  end
end
