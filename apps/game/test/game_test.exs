defmodule GameTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Dice,
    Settings
  }

  test "start/2" do
    assert %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{},
            2 => %Dice{},
            3 => %Dice{},
            4 => %Dice{},
            5 => %Dice{},
            6 => %Dice{}
          },
          health: 15,
          tokens: 0,
          turns: 3,
          user: "Wesley"
        },
        2 => %Player{
          dices: %{
            1 => %Dice{},
            2 => %Dice{},
            3 => %Dice{},
            4 => %Dice{},
            5 => %Dice{},
            6 => %Dice{}
          },
          health: 15,
          tokens: 0,
          turns: 3,
          user: "Jeffrey"
        }
      },
      rounds: [],
      settings: %Settings{
        dices: 6,
        health: 15,
        phases: %{
          1 => %{module: Game.Phase.Roll, turns: 3},
          2 => %{module: Game.Phase.GodFavor, turns: 1},
          3 => %{module: Game.Phase.Resolution, turns: 1}
        },
        tokens: 0
      },
      phase: 1
    } = Game.start("Wesley", "Jeffrey")
  end

  describe "determine_next_turn/1" do
    test "when in bounds" do
      game = %{
        players: %{
          1 => %Player{user: "Wesley"},
          2 => %Player{user: "Jeffrey"}
        },
        turn: 1
      }

      actual = Game.determine_next_turn(game)
      expected = 2

      assert actual == expected
    end

    test "when out of bounds" do
      game = %{
        players: %{
          1 => %Player{user: "Wesley"},
          2 => %Player{user: "Jeffrey"}
        },
        turn: 2
      }

      actual = Game.determine_next_turn(game)
      expected = 1

      assert actual == expected
    end
  end

  describe "determine_next_phase/1" do
    test "when in bounds" do
      game = %{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        phase: 1
      }

      actual = Game.determine_next_phase(game)
      expected = 2

      assert actual == expected
    end

    test "when out of bounds" do
      game = %{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        phase: 3
      }

      actual = Game.determine_next_phase(game)
      expected = 1

      assert actual == expected
    end
  end

  describe "next_turn/1" do
    test "when players have turns left" do
      game = %{
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

      actual = Game.next_turn(game)

      expected = %{
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
      game = %{
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

      actual = Game.next_turn(game)

      expected = %{
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

  test "next_phase/1" do
    game = %{
      settings: %Settings{
        phases: %{
          1 => %{module: Game.Phase.Roll, turns: 3}
        }
      },
      players: %{
        1 => %Player{user: "Wesley", turns: 0},
        2 => %Player{user: "Jeffrey", turns: 0}
      },
      turn: 1,
      phase: 0
    }

    actual = Game.next_phase(game)

    expected = %{
      settings: %Settings{
        phases: %{
          1 => %{module: Game.Phase.Roll, turns: 3}
        }
      },
      players: %{
        1 => %Player{user: "Wesley", turns: 3},
        2 => %Player{user: "Jeffrey", turns: 3}
      },
      turn: 1,
      phase: 1
    }

    assert actual == expected
  end

  describe "try_next_phase/1" do
    test "when players have turns left" do
      game = %{
        players: %{
          1 => %Player{user: "Wesley", turns: 3},
          2 => %Player{user: "Jeffrey", turns: 3}
        },
        turn: 1,
        phase: 1
      }

      actual = Game.try_next_phase(game)

      expected = %{
        players: %{
          1 => %Player{user: "Wesley", turns: 3},
          2 => %Player{user: "Jeffrey", turns: 3}
        },
        turn: 1,
        phase: 1
      }

      assert actual == expected
    end

    test "when players have no turns left" do
      game = %{
        settings: %Settings{
          phases: %{
            1 => %{module: Game.Phase.Roll, turns: 3},
            2 => %{module: Game.Phase.GodFavor, turns: 1},
            3 => %{module: Game.Phase.Resolution, turns: 1}
          }
        },
        players: %{
          1 => %Player{user: "Wesley", turns: 0},
          2 => %Player{user: "Jeffrey", turns: 0}
        },
        turn: 1,
        phase: 1
      }

      actual = Game.try_next_phase(game)

      expected = %{
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
        turn: 1,
        phase: 2
      }

      assert actual == expected
    end
  end

  test "current_player/1" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    actual = Game.current_player(game)
    expected = %Player{user: "Wesley"}

    assert actual == expected
  end

  test "opponent_player/1" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    actual = Game.opponent_player(game)
    expected = %Player{user: "Jeffrey"}

    assert actual == expected
  end

  test "update_players/2" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    fun = fn player -> %{player | tokens: 999} end

    actual = Game.update_players(game, &fun.(&1))

    expected = %Game{
      players: %{
        1 => %Player{user: "Wesley", tokens: 999},
        2 => %Player{user: "Jeffrey", tokens: 999}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "update_current_player/2" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    player = %Player{user: "Wesley de Bruijn"}

    actual = Game.update_current_player(game, player)

    expected = %Game{
      players: %{
        1 => %Player{user: "Wesley de Bruijn"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    assert actual == expected
  end

  test "update_opponent_player/2" do
    game = %Game{
      players: %{
        1 => %Player{user: "Wesley"},
        2 => %Player{user: "Jeffrey"}
      },
      turn: 1
    }

    player = %Player{user: "Jeffrey van Hoven"}

    actual = Game.update_opponent_player(game, player)

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
