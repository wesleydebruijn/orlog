defmodule Favor.BaldrsInvurnerability do
  @behaviour Favor
  @moduledoc """
  Baldr's Invurnerability increases your defence rolls by a fixed amount.

  Tier 1: +1 to melee and ranged block dice for 3 God Favor.
  Tier 2: +2 to melee and ranged block dice for 6 God Favor.
  Tier 3: +3 to melee and ranged block dice for 9 God Favor.
  """
  @tiers %{
    1 => %{cost: 3, defence: 1},
    2 => %{cost: 6, defence: 2},
    3 => %{cost: 9, defence: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player = Game.current_player(game)

    opponent =
      player
      |> Map.get(:dices)
      |> Enum.filter(fn {_index, die} ->
        die.face == Game.Dice.Face.MeleeBlock.get() or
          die.face == Game.Dice.Face.RangedBlock.get()
      end)
      |> Enum.reduce(player, fn {index, _die}, acc ->
        Game.Player.update_dice(acc, index, fn die ->
          Game.Dice.update_face(die, %{
            amount: die.face.amount + options.defence
          })
        end)
      end)

    Game.update_current_player(game, opponent)
  end
end
