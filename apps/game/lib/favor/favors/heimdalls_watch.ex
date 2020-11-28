defmodule Favor.HeimdallsWatch do
  @behaviour Favor
  @moduledoc """
  Heimdalls Watch grants health for each succesful block.

  Tier 1: each succesful block heals 1 for 4 God Favor.
  Tier 2: each succesful block heals 2 for 7 God Favor.
  Tier 3: each succesful block heals 3 for 10 God Favor.
  """
  @tiers %{
    1 => %{cost: 4, block_heal: 1},
    2 => %{cost: 7, block_heal: 2},
    3 => %{cost: 10, block_heal: 3}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player = Game.current_player(game)

    updated_player =
      player
      |> Map.get(:dices)
      |> Enum.filter(fn {_index, die} ->
        die.face.stance == :block
      end)
      |> Enum.reduce(player, fn {index, _die}, acc ->
        Game.Player.update_dice(acc, index, fn die ->
          Game.Dice.update_face(die, %{
            health: options.block_heal
          })
        end)
      end)

    Game.update_current_player(game, updated_player)
  end
end
