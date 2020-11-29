defmodule Favor.HelsGrip do
  @behaviour Favor
  @moduledoc """
  Hel’s Grip heals you for each melee attack dice your opponent hits you with.

  Tier 1: heal 1 damage for each melee attack for 6 God Favor.
  Tier 2: heal 2 damage for each melee attack for 12 God Favor.
  Tier 3: heal 3 damage for each melee attack for 18 God Favor.
  """
  @tiers %{
    1 => %{cost: 4, heal_per_melee: 1},
    2 => %{cost: 8, heal_per_melee: 2},
    3 => %{cost: 12, heal_per_melee: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    opponent = Game.opponent_player(game)

    updated_opponent =
      opponent
      |> Map.get(:dices)
      |> Enum.filter(fn {_index, die} ->
        die.face == Game.Dice.Face.MeleeAttack.get()
      end)
      |> Enum.reduce(opponent, fn {index, _die}, acc ->
        Game.Player.update_dice(acc, index, fn die ->
          Game.Dice.update_face(die, %{
            health_opponent: options.heal_per_melee
          })
        end)
      end)

    Game.update_opponent_player(game, updated_opponent)
  end
end
