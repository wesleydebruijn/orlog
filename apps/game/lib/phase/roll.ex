defmodule Game.Phase.Roll do
  @moduledoc """
  Roll phase
  """
  alias Game.{
    Phase,
    Player,
    Dice
  }

  @behaviour Phase

  @rolls 3
  @dices 6

  @impl Phase
  def start(game), do: game

  @impl Phase
  def execute(%{turns: turns} = game, :continue) when rem(turns, @rolls * 2) == 0 do
    finish(game)
  end

  def execute(game, :continue) do
    player = Enum.find(game.players, & &1.turn)

    if player.rolled do
      # lock kept dices, swap turn
    else
      # roll dices, roll + 1
    end

    # check to go to next phase
  end

  def execute(game, _action), do: game

  @impl Phase
  def finish(game) do
    if Enum.count(game.rounds) == 1 do
      Game.next_phase(game, Phase.Resolution)
    else
      Game.next_phase(game, Phase.GodFavor)
    end
  end
end
