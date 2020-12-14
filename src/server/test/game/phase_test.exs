defmodule Game.PhaseTest do
  use ExUnit.Case

  alias Game.{
    Settings,
    Player,
    Phase
  }

  describe "determine_next/1" do
    test "when in bounds" do
      game = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        phase: 1
      }

      actual = Phase.determine_next(game)
      expected = 2

      assert actual == expected
    end

    test "when out of bounds" do
      game = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        phase: 3
      }

      actual = Phase.determine_next(game)
      expected = 1

      assert actual == expected
    end
  end

  test "next/1" do
    game = %Game{
      settings: %Settings{
        phases: %{
          1 => %{module: Game.Phase.Roll, turns: 3}
        }
      },
      players: %{
        1 => %Player{user: %User{name: "Wesley"}, turns: 0},
        2 => %Player{user: %User{name: "Jeffrey"}, turns: 0}
      },
      turn: 1,
      phase: 0
    }

    actual = Phase.next(game)

    expected = %Game{
      settings: %Settings{
        phases: %{
          1 => %{module: Game.Phase.Roll, turns: 3}
        }
      },
      players: %{
        1 => %Player{user: %User{name: "Wesley"}, turns: 3},
        2 => %Player{user: %User{name: "Jeffrey"}, turns: 3}
      },
      turn: 1,
      phase: 1
    }

    assert actual == expected
  end

  describe "try_next/1" do
    test "when players have turns left" do
      game = %Game{
        players: %{
          1 => %Player{user: %User{name: "Wesley"}, turns: 3},
          2 => %Player{user: %User{name: "Jeffrey"}, turns: 3}
        },
        turn: 1,
        phase: 1
      }

      actual = Phase.try_next(game)

      expected = %Game{
        players: %{
          1 => %Player{user: %User{name: "Wesley"}, turns: 3},
          2 => %Player{user: %User{name: "Jeffrey"}, turns: 3}
        },
        turn: 1,
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
          1 => %Player{user: %User{name: "Wesley"}, turns: 0},
          2 => %Player{user: %User{name: "Jeffrey"}, turns: 0}
        },
        turn: 1,
        phase: 1
      }

      actual = Phase.try_next(game)

      expected = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: %User{name: "Wesley"}, turns: 1},
          2 => %Player{user: %User{name: "Jeffrey"}, turns: 1}
        },
        turn: 1,
        phase: 2
      }

      assert actual == expected
    end

    test "when players have no turns left and no phase left" do
      game = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: %User{name: "Wesley"}, turns: 0, health: 15},
          2 => %Player{user: %User{name: "Jeffrey"}, turns: 0, health: 15}
        },
        turn: 1,
        phase: 3,
        round: 1
      }

      actual = Phase.try_next(game)

      expected = %Game{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: %User{name: "Wesley"}, turns: 3, health: 15},
          2 => %Player{user: %User{name: "Jeffrey"}, turns: 3, health: 15}
        },
        turn: 1,
        phase: 1,
        round: 2
      }

      assert actual == expected
    end
  end
end
