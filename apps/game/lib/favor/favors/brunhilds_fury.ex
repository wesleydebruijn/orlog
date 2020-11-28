defmodule Favor.BrunhildsFury do
  @behaviour Favor
  @moduledoc """
  Brunhild's Fury multiplies your melee attack dice.

  Tier 1: multiplies melee attack dice by 1.5 for 6 God Favor.
  Tier 2: multiplies melee attack dice by 2 for 10 God Favor.
  Tier 3: multiplies melee attack dice by 3 for 18 God Favor.
  """
  @tiers %{
    1 => %{cost: 6, melee_multiplier: 1.5},
    2 => %{cost: 10, melee_multiplier: 2},
    3 => %{cost: 18, melee_multiplier: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player = Game.current_player(game)

    updated_player =
      player
      |> Map.get(:dices)
      |> Enum.filter(fn {_index, die} ->
        die.face == Game.Dice.Face.MeleeAttack.get()
      end)
      |> Enum.reduce(player, fn {index, _die}, acc ->
        Game.Player.update_dice(acc, index, fn die ->
          Game.Dice.update_face(die, %{
            amount: die.face.amount * options.melee_multiplier
          })
        end)
      end)

    Game.update_current_player(game, updated_player)
  end
end
