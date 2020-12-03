defmodule Game.TurnTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Settings,
    Turn
  }

  test "coinflip/1" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      }
    }

    actual = Turn.coinflip(game).turn

    assert Enum.member?([1, 2], actual)
  end

  describe "determine_next/1" do
    test "when in bounds" do
      game = %Game{
        players: %{
          1 => %Player{user: "Wesley"},
          2 => %Player{user: "Jeffrey"}
        },
        turn: 1
      }

      actual = Turn.determine_next(game)
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

      actual = Turn.determine_next(game)
      expected = 1

      assert actual == expected
    end
  end

  describe "next/1" do
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

      actual = Turn.next(game)

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

      actual = Turn.next(game)

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

  test "get_player/1" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    actual = Turn.get_player(game)
    expected = %Player{user: "Wesley"}

    assert actual == expected
  end

  test "get_opponent/1" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    actual = Turn.get_opponent(game)
    expected = %Player{user: "Jeffrey"}

    assert actual == expected
  end

  test "update_player/2" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    fun = fn player -> %{player | user: "Wesley de Bruijn"} end

    actual = Turn.update_player(game, fun)

    expected = %Game{
      players: %{
        1 => %Player{user: "Wesley de Bruijn"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "update_opponent/2" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    fun = fn player -> %{player | user: "Jeffrey van Hoven"} end

    actual = Turn.update_opponent(game, fun)

    expected = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey van Hoven"}
      },
      turn: 1
    }

    assert actual == expected
  end
end
