defmodule IndexMapTest do
  use ExUnit.Case

  test "get/2" do
    items = %{
      1 => %{items: [1, 2]},
      2 => %{items: [3, 4]}
    }

    actual = IndexMap.get(items, 2)
    expected = %{items: [3, 4]}

    assert actual == expected
  end

  test "dig/2" do
    dices = %{
      1 => %{face: %{amount: 33}},
      2 => %{face: %{amount: 44}}
    }

    actual = IndexMap.dig(dices, :face)

    expected = %{
      1 => %{amount: 33},
      2 => %{amount: 44}
    }

    assert actual == expected
  end

  test "update/4" do
    map = %{
      key: %{
        1 => %{items: [1, 2], name: "test"},
        2 => %{items: [3, 4], name: "test"}
      }
    }

    fun = fn item -> %{item | items: []} end

    actual = IndexMap.update(map, :key, 2, fun)

    expected = %{
      key: %{
        1 => %{items: [1, 2], name: "test"},
        2 => %{items: [], name: "test"}
      }
    }

    assert actual == expected
  end

  test "update_all/3" do
    map = %{
      key: %{
        1 => %{items: [1, 2], name: "test"},
        2 => %{items: [3, 4], name: "test"}
      }
    }

    fun = fn item -> %{item | items: []} end

    actual = IndexMap.update_all(map, :key, fun)

    expected = %{
      key: %{
        1 => %{items: [], name: "test"},
        2 => %{items: [], name: "test"}
      }
    }

    assert actual == expected
  end

  test "update_in/4" do
    map = %{
      key: %{
        1 => %{items: [1, 2], name: "test"},
        2 => %{items: [3, 4], name: "test"}
      }
    }

    fun = fn item -> %{item | items: []} end

    actual =
      map
      |> Map.get(:key)
      |> Enum.take(1)
      |> IndexMap.update_in(map, :key, fun)

    expected = %{
      key: %{
        1 => %{items: [], name: "test"},
        2 => %{items: [3, 4], name: "test"}
      }
    }

    assert actual == expected
  end

  test "filter/2" do
    items = %{
      1 => %{items: [1, 2], name: "test"},
      2 => %{items: [3, 4], name: "test"}
    }

    fun = fn item -> item.items == [1, 2] end

    actual = IndexMap.filter(items, fun)

    expected = [
      {1, %{items: [1, 2], name: "test"}}
    ]

    assert actual == expected
  end

  test "sum/2" do
    items = %{
      1 => %{items: [1, 2], name: "test"},
      2 => %{items: [3, 4], name: "test"}
    }

    fun = fn item -> Enum.sum(item.items) end

    actual = IndexMap.sum(items, fun)
    expected = 10

    assert actual == expected
  end

  test "take/2" do
    items = %{
      1 => %{items: [1, 2], name: "test"},
      2 => %{items: [3, 4], name: "test"}
    }

    actual = IndexMap.take(items, 1)

    expected = %{
      1 => %{items: [1, 2], name: "test"}
    }

    assert actual == expected
  end

  test "take_random/2" do
    items = %{
      1 => %{items: [1, 2], name: "test"},
      2 => %{items: [3, 4], name: "test"}
    }

    actual = IndexMap.take_random(items, 1)

    assert Enum.count(actual) == 1
  end

  test "majority/2" do
    items = %{
      1 => %{items: [1, 2], name: "test"},
      2 => %{items: [3, 4], name: "other"},
      3 => %{items: [5, 6], name: "test"}
    }

    fun = fn item -> item.name end

    actual = IndexMap.majority(items, fun)

    expected = [
      {1, %{items: [1, 2], name: "test"}},
      {3, %{items: [5, 6], name: "test"}}
    ]

    assert actual == expected
  end

  describe "add/2" do
    test "when map is empty" do
      items = %{}

      list = [3, 2, 1]

      actual = IndexMap.add(items, list)

      expected = %{
        1 => 3,
        2 => 2,
        3 => 1
      }

      assert actual == expected
    end

    test "when map is not empty" do
      items = %{
        1 => 6,
        2 => 5,
        3 => 4
      }

      list = [3, 2, 1]

      actual = IndexMap.add(items, list)

      expected = %{
        1 => 6,
        2 => 5,
        3 => 4,
        4 => 3,
        5 => 2,
        6 => 1
      }

      assert actual == expected
    end
  end
end
