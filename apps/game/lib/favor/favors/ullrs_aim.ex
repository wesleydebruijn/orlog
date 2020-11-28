defmodule Favor.UllrsAim do
  @behaviour Favor
  @moduledoc """
  Ullrs Aim bypasses a fixed amount of ranged block dice.

  Tier 1: 2 ranged block bypasses for 2 God Favor.
  Tier 2: 3 ranged block bypasses for 3 God Favor.
  Tier 3: 6 ranged block bypasses for 6 God Favor.
  """

  @tiers %{
    1 => %{cost: 4, ranged_bypass: 2},
    2 => %{cost: 3, ranged_bypass: 3},
    3 => %{cost: 6, ranged_bypass: 6}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player = Game.opponent_player(game)

    opponent =
      player
      |> Map.get(:dices)
      |> Enum.filter(fn {_index, die} ->
        die.face == Game.Dice.Face.RangedBlock.get()
      end)
      |> Enum.take(options.ranged_bypass)
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
