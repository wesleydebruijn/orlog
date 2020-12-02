defmodule Game.Action.BlockTest do
  use ExUnit.Case

  alias Game.{
    Player,
    Action,
    Dice,
    Dice.Face
  }

  test "increase_ranged_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :block,
                type: :ranged,
                intersects: 1,
                amount: 1
              }
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :attack,
                type: :ranged,
                intersects: 1
              }
            }
          }
        }
      },
      turn: 1
    }

    actual = Action.Block.increase_ranged_block(game, 1)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :block,
                type: :ranged,
                intersects: 1,
                amount: 2
              }
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :attack,
                type: :ranged,
                intersects: 1
              }
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "increase_melee_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :block,
                type: :melee,
                intersects: 1,
                amount: 1
              }
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :attack,
                type: :melee,
                intersects: 1
              }
            }
          }
        }
      },
      turn: 1
    }

    actual = Action.Block.increase_melee_block(game, 1)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :block,
                type: :melee,
                intersects: 1,
                amount: 2
              }
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :attack,
                type: :melee,
                intersects: 1
              }
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "increase_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :block,
                type: :ranged,
                amount: 1
              }
            },
            2 => %Dice{
              face: %Face{
                stance: :block,
                type: :melee,
                amount: 1
              }
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :attack,
                type: :melee
              }
            }
          }
        }
      },
      turn: 1
    }

    actual = Action.Block.increase_block(game, 1)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :block,
                type: :ranged,
                amount: 2
              }
            },
            2 => %Dice{
              face: %Face{
                stance: :block,
                type: :melee,
                amount: 2
              }
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{
                stance: :attack,
                type: :melee
              }
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "bypass_ranged_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :ranged}
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :ranged}
            }
          }
        }
      },
      turn: 1
    }

    actual = Action.Block.bypass_ranged_block(game, 1)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :ranged}
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :ranged, disabled: true}
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "bypass_melee_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee}
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :melee}
            }
          }
        }
      },
      turn: 1
    }

    actual = Action.Block.bypass_melee_block(game, 1)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee}
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :melee, disabled: true}
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end

  test "bypass_block/2" do
    game = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee}
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :melee}
            },
            2 => %Dice{
              face: %Face{stance: :block, type: :ranged}
            }
          }
        }
      },
      turn: 1
    }

    actual = Action.Block.bypass_block(game, 2)

    expected = %Game{
      players: %{
        1 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :attack, type: :melee}
            }
          }
        },
        2 => %Player{
          dices: %{
            1 => %Dice{
              face: %Face{stance: :block, type: :melee, disabled: true}
            },
            2 => %Dice{
              face: %Face{stance: :block, type: :ranged, disabled: true}
            }
          }
        }
      },
      turn: 1
    }

    assert actual == expected
  end
end
