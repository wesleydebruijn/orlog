defmodule Favor.FreyrsGift do
  @behaviour Favor
  @moduledoc """
  Freyr's Gift adds a fixed amount to the majority of die faces.

  Tier 1: adds 2 amount to the majority of die faces for 4 God Favor.
  Tier 2: adds 3 amount to the majority of die faces for 6 God Favor.
  Tier 3: adds 4 amount to the majority of die faces for 8 God Favor.
  """
  @tiers %{
    1 => %{cost: 4, amount: 2},
    2 => %{cost: 6, amount: 3},
    3 => %{cost: 8, amount: 4}
  }

  use Favor

  @impl Favor
  def invoke(game, options) do
    player = Game.current_player(game)

    to_update_face =
      player
      |> Map.get(:dices)
      |> Enum.reduce(%{}, fn {_index, die}, acc ->
        Map.put(acc, die.face, Map.get(acc, die.face, 0) + 1)
      end)
      |> Enum.reduce(fn die_face, acc ->
        {_face, amount} = die_face
        {_, current_amount} = acc

        if amount > current_amount do
          die_face
        else
          acc
        end
      end)
      |> elem(0)

    {die_index, die} =
      player
      |> Map.get(:dices)
      |> Enum.find(fn {_index, die} -> die.face == to_update_face end)

    Game.update_current_player(
      game,
      Game.Player.update_dice(player, die_index, fn die ->
        Game.Dice.update_face(die, %{
          amount: die.face.amount + options.amount
        })
      end)
    )
  end
end
