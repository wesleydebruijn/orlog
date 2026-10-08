defmodule Game.LobbyTest do
  use ExUnit.Case

  alias Game.{Dice, Lobby, Player, Settings}
  alias Game.Dice.Face

  @resolution 3

  defp lobby(turns, dices, opts \\ []) do
    %Lobby{
      game: %Game{
        phase: Keyword.get(opts, :phase, @resolution),
        turn: 1,
        settings: %Settings{},
        players: %{
          1 => %Player{turns: turns, dices: dices},
          2 => %Player{turns: turns}
        }
      }
    }
  end

  defp attacks(count, extra \\ %{}) do
    Enum.into(1..count, %{}, fn i ->
      {i, %Dice{face: Map.merge(%Face{stance: :attack, type: :melee}, extra)}}
    end)
  end

  describe "auto_turn_delay/1" do
    test "defaults to 1.5 seconds for steps that are not played out die by die" do
      for turns <- [7, 6, 5, 2, 1] do
        assert Lobby.auto_turn_delay(lobby(turns, attacks(6))) == 1500
      end
    end

    test "defaults outside of the resolution phase" do
      assert Lobby.auto_turn_delay(lobby(4, attacks(6), phase: 1)) == 1500
    end

    test "attack step leaves a beat for every attacking die" do
      assert Lobby.auto_turn_delay(lobby(4, attacks(4))) == 500 + 650 * 4
    end

    test "attack step never goes below the default" do
      assert Lobby.auto_turn_delay(lobby(4, attacks(1))) == 1500
      assert Lobby.auto_turn_delay(lobby(4, %{})) == 1500
    end

    test "attack step ignores disabled dice and other stances" do
      dices = %{
        1 => %Dice{face: %Face{stance: :attack, type: :melee}},
        2 => %Dice{face: %Face{stance: :attack, type: :ranged}},
        3 => %Dice{face: %Face{stance: :attack, type: :ranged, disabled: true}},
        4 => %Dice{face: %Face{stance: :block, type: :melee}},
        5 => %Dice{face: %Face{stance: :steal, type: :token}}
      }

      assert Lobby.auto_turn_delay(lobby(4, dices)) == 500 + 650 * 2
      assert Lobby.auto_turn_delay(lobby(4, Map.put(dices, 6, dices[1]))) == 500 + 650 * 3
    end

    test "attack step counts every hit of a die" do
      assert Lobby.auto_turn_delay(lobby(4, attacks(2, %{count: 2}))) == 500 + 650 * 4
    end

    test "attack step still plays attacks that were fully blocked" do
      blocked = attacks(3, %{intersects: 1})

      assert Lobby.auto_turn_delay(lobby(4, blocked)) == 500 + 650 * 3
    end

    test "steal step leaves a beat for every hand" do
      hands =
        Enum.into(1..3, %{}, fn i -> {i, %Dice{face: %Face{stance: :steal, type: :token}}} end)

      assert Lobby.auto_turn_delay(lobby(3, hands)) == 500 + 650 * 3
      assert Lobby.auto_turn_delay(lobby(3, attacks(5))) == 1500
    end
  end
end
