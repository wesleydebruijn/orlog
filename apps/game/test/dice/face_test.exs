defmodule Game.Dice.FaceTest do
  use ExUnit.Case

  alias Game.Dice
  alias Game.Dice.Face

  describe "intersects?/2" do
    test "when type is correct and same type" do
      face = %Face{stance: :block, type: :melee}
      other = %Face{stance: :attack, type: :melee}

      actual = Face.intersects?(face, other)
      expected = true

      assert actual == expected
    end

    test "when block is disabled" do
      face = %Face{stance: :block, type: :melee, disabled: true}
      other = %Face{stance: :attack, type: :melee}

      actual = Face.intersects?(face, other)
      expected = false

      assert actual == expected
    end

    test "when attack is disabled" do
      face = %Face{stance: :block, type: :melee}
      other = %Face{stance: :attack, type: :melee, disabled: true}

      actual = Face.intersects?(face, other)
      expected = false

      assert actual == expected
    end

    test "when stance differ" do
      face = %Face{stance: :block, type: :melee}
      other = %Face{stance: :attack, type: :ranged}

      actual = Face.intersects?(face, other)
      expected = false

      assert actual == expected
    end

    test "when attack has no count" do
      face = %Face{stance: :block, type: :melee}
      other = %Face{stance: :attack, type: :melee, count: 0}

      actual = Face.intersects?(face, other)
      expected = false

      assert actual == expected
    end

    test "when block has no count" do
      face = %Face{stance: :block, type: :melee, count: 0}
      other = %Face{stance: :attack, type: :melee}

      actual = Face.intersects?(face, other)
      expected = false

      assert actual == expected
    end
  end

  describe "stance?/2" do
    test "when stance matches" do
      assert Face.stance?(%Face{stance: :block}, :block)
    end

    test "when stance matches with dice" do
      assert Face.stance?(%Dice{face: %Face{stance: :block}}, :block)
    end

    test "when stance doesnt match" do
      refute Face.stance?(%Face{stance: :block}, :attack)
    end
  end

  describe "type?/2" do
    test "when type matches" do
      assert Face.type?(%Face{type: :melee}, :melee)
    end

    test "when type matches with dice" do
      assert Face.type?(%Dice{face: %Face{type: :melee}}, :melee)
    end

    test "when type doesnt match" do
      refute Face.type?(%Face{type: :melee}, :ranged)
    end
  end

  describe "hits/1" do
    test "when disabled" do
      actual = Face.hits(%Face{disabled: true, intersects: 1})
      expected = 0

      assert actual == expected
    end

    test "when block stance" do
      actual = Face.hits(%Face{stance: :block, intersects: 1})
      expected = 1

      assert actual == expected
    end

    test "when attack stance" do
      actual = Face.hits(%Face{stance: :attack, intersects: 1, count: 2})
      expected = 1

      assert actual == expected
    end

    test "when steal stance" do
      actual = Face.hits(%Face{stance: :steal, intersects: 1, count: 2})
      expected = 1

      assert actual == expected
    end
  end

  describe "hit_amount/1" do
    test "when dice" do
      actual = Face.hit_amount(%Dice{face: %Face{stance: :attack, amount: 2, count: 2}})
      expected = 4

      assert actual == expected
    end

    test "when face" do
      actual = Face.hit_amount(%Face{stance: :attack, amount: 2, count: 2})
      expected = 4

      assert actual == expected
    end
  end

  describe "resolve_face/2" do
    test "single attack blocked by oponnent block" do
      faces = %{
        1 => %Face{stance: :attack, type: :melee, count: 1},
        2 => %Face{stance: :attack, type: :melee, count: 1}
      }

      face = %Face{stance: :block, type: :melee}

      actual = Dice.Face.resolve_face(faces, face)

      expected = %{
        1 => %Face{stance: :attack, type: :melee, count: 1, intersects: 1},
        2 => %Face{stance: :attack, type: :melee, count: 1}
      }

      assert actual == expected
    end

    test "multiple attacks blocked by oponnent block" do
      faces = %{
        1 => %Face{stance: :attack, type: :melee, count: 2},
        2 => %Face{stance: :attack, type: :melee, count: 1}
      }

      face = %Face{stance: :block, type: :melee, count: 2}

      actual = Dice.Face.resolve_face(faces, face)

      expected = %{
        1 => %Face{stance: :attack, type: :melee, count: 2, intersects: 2},
        2 => %Face{stance: :attack, type: :melee, count: 1}
      }

      assert actual == expected
    end

    test "single block by oponnent attack" do
      faces = %{
        1 => %Face{stance: :block, type: :melee, count: 2},
        2 => %Face{stance: :block, type: :melee, count: 1}
      }

      face = %Face{stance: :attack, type: :melee, count: 1}

      actual = Dice.Face.resolve_face(faces, face)

      expected = %{
        1 => %Face{stance: :block, type: :melee, count: 2, intersects: 1},
        2 => %Face{stance: :block, type: :melee, count: 1}
      }

      assert actual == expected
    end

    test "multiple block by oponnent attack" do
      faces = %{
        1 => %Face{stance: :block, type: :melee, count: 2},
        2 => %Face{stance: :block, type: :melee, count: 1}
      }

      face = %Face{stance: :attack, type: :melee, count: 2}

      actual = Dice.Face.resolve_face(faces, face)

      expected = %{
        1 => %Face{stance: :block, type: :melee, count: 2, intersects: 2},
        2 => %Face{stance: :block, type: :melee, count: 1}
      }

      assert actual == expected
    end

    test "no opoosing face" do
      faces = %{
        1 => %Face{stance: :steal, type: :token, count: 1}
      }

      face = %Face{stance: :attack, type: :melee, count: 2}

      actual = Dice.Face.resolve_face(faces, face)

      expected = %{
        1 => %Face{stance: :steal, type: :token, count: 1}
      }

      assert actual == expected
    end
  end

  test "resolve/2" do
    faces = %{
      1 => %Face{stance: :attack, type: :melee, count: 1},
      2 => %Face{stance: :attack, type: :melee, count: 2},
      3 => %Face{stance: :attack, type: :melee, count: 1},
      4 => %Face{stance: :attack, type: :ranged, count: 1},
      5 => %Face{stance: :attack, type: :ranged, count: 1},
      6 => %Face{stance: :attack, type: :ranged, count: 2},
      7 => %Face{stance: :block, type: :melee, count: 1},
      8 => %Face{stance: :block, type: :melee, count: 1},
      9 => %Face{stance: :block, type: :melee, count: 1},
      10 => %Face{stance: :block, type: :ranged, count: 1},
      11 => %Face{stance: :block, type: :ranged, count: 1}
    }

    other = %{
      1 => %Face{stance: :block, type: :melee, count: 1},
      2 => %Face{stance: :block, type: :melee, count: 1},
      3 => %Face{stance: :block, type: :ranged, count: 3},
      4 => %Face{stance: :attack, type: :melee, count: 2},
      5 => %Face{stance: :attack, type: :ranged, count: 1}
    }

    actual = Face.resolve(faces, other)

    expected = %{
      1 => %Face{stance: :attack, type: :melee, count: 1, intersects: 1},
      2 => %Face{stance: :attack, type: :melee, count: 2, intersects: 1},
      3 => %Face{stance: :attack, type: :melee, count: 1},
      4 => %Face{stance: :attack, type: :ranged, count: 1, intersects: 1},
      5 => %Face{stance: :attack, type: :ranged, count: 1, intersects: 1},
      6 => %Face{stance: :attack, type: :ranged, count: 2, intersects: 1},
      7 => %Face{stance: :block, type: :melee, count: 1, intersects: 1},
      8 => %Face{stance: :block, type: :melee, count: 1, intersects: 1},
      9 => %Face{stance: :block, type: :melee, count: 1},
      10 => %Face{stance: :block, type: :ranged, count: 1, intersects: 1},
      11 => %Face{stance: :block, type: :ranged, count: 1}
    }

    assert actual == expected
  end
end
