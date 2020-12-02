defmodule Game.FavorTest do
  use ExUnit.Case

  alias Game.{
    Favor,
    Player
  }

  describe "invoke?/3" do
    test "when trigger and affects matches with favor" do
      favor = %Favor{
        affects: :opponent,
        trigger: :pre_resolution
      }

      assert Favor.invoke?(favor, :pre_resolution, :opponent)
    end

    test "when trigger differs from favor" do
      favor = %Favor{
        affects: :opponent,
        trigger: :post_favor
      }

      refute Favor.invoke?(favor, :pre_resolution, :opponent)
    end

    test "when affects differs from favor" do
      favor = %Favor{
        affects: :player,
        trigger: :pre_resolution
      }

      refute Favor.invoke?(favor, :pre_resolution, :opponent)
    end
  end

  describe "invoke/2" do
    test "when player has a favor selected" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 1}
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Favor.invoke(game)

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 1},
            health: 1
          },
          2 => %Player{}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when player has no favor selected" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1}
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Favor.invoke(game)

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1}
          },
          2 => %Player{}
        },
        turn: 1
      }

      assert actual == expected
    end
  end

  describe "invoke/3" do
    test "when player has favor & sufficient tokens" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 2},
            tokens: 6
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Favor.invoke(game, :pre_favor, :any)

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 2},
            tokens: 0,
            health: 2
          },
          2 => %Player{}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when cannot be invoked" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 2},
            tokens: 6
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Favor.invoke(game, :pre_resolution, :any)

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 2},
            tokens: 6
          },
          2 => %Player{}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when player has insufficient tokens" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 2},
            tokens: 5
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Favor.invoke(game, :pre_favor, :any)

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            favor_tier: {1, 2},
            tokens: 5
          },
          2 => %Player{}
        },
        turn: 1
      }

      assert actual == expected
    end

    test "when player has no active favor" do
      game = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            tokens: 6
          },
          2 => %Player{}
        },
        turn: 1
      }

      actual = Favor.invoke(game, :pre_favor, :any)

      expected = %Game{
        players: %{
          1 => %Player{
            favors: %{1 => 1},
            tokens: 6
          },
          2 => %Player{}
        },
        turn: 1
      }

      assert actual == expected
    end
  end
end
