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
                 user: %User{
                   name: "Wesley"
                 }
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
                 user: %User{
                   name: "Jeffrey"
                 }
               }
             },
             settings: %Settings{
               dices: 6,
               health: 15,
               phases: %{
                 1 => %{module: Game.Phase.Roll, turns: 3},
                 2 => %{module: Game.Phase.GodFavor, turns: 1},
                 3 => %{module: Game.Phase.Resolution, turns: 8}
               },
               tokens: 0
             },
             round: 1,
             phase: 1
           } = Game.start([%User{name: "Wesley"}, %User{name: "Jeffrey"}])
  end
end
