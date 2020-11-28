defmodule Favor.VidarsMight do
  @behaviour Favor
  @moduledoc """
  Vidar's Might removes a number of melee defence rolls of the opponent.

  Tier 1: 2 melee defences for 2 God Favor.
  Tier 2: 4 melee defences for 3 God Favor.
  Tier 3: 6 melee defences for 6 God Favor.
  """
  @tiers %{
    1 => %{cost: 2, melee_bypass: 2},
    2 => %{cost: 3, melee_bypass: 4},
    3 => %{cost: 6, melee_bypass: 6}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player = Game.opponent_player(game)

    opponent =
      player
      |> Map.get(:dices)
      |> Enum.filter(fn {_index, die} ->
        die.face == Game.Dice.Face.MeleeBlock.get()
      end)
      |> Enum.take(options.melee_bypass)
      |> Enum.reduce(player, fn {index, _die}, acc ->
        Game.Player.update_dice(acc, index, fn die ->
          Game.Dice.update_face(die, %{
            disabled: true
          })
        end)
      end)

    Game.update_opponent_player(game, opponent)
  end
end
