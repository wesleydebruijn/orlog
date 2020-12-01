defmodule Game.Favor.FreyrsGift do
  @behaviour Game.Favor
  @moduledoc """
  Freyr's Gift adds a fixed amount to the majority of die faces.

  Tier 1: adds 2 amount to the majority of die faces for 4 God Favor.
  Tier 2: adds 3 amount to the majority of die faces for 6 God Favor.
  Tier 3: adds 4 amount to the majority of die faces for 8 God Favor.
  """
  alias Game.{
    Turn,
    Player,
    Dice
  }

  @tiers %{
    1 => %{cost: 4, amount: 2},
    2 => %{cost: 6, amount: 3},
    3 => %{cost: 8, amount: 4}
  }

  use Game.Favor

  @impl Game.Favor
  def invoke(game, options) do
    game
    |> Turn.update_player(fn player ->
      # Determine which dice has the majority.
      majority_face =
        player.dices
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

      # Find the first dice that has the majority face
      # and retrieve the first of its kind.
      {die_index, _die} =
        Enum.find(player.dices, fn {_index, die} ->
          die.face == majority_face
        end)

      # Update the player' dices to reflect
      # the new amount.
      IndexMap.update(player, :dices, die_index, fn dice ->
        dice
        |> Dice.update_face(%{amount: dice.face.amount + options.amount})
      end)
    end)
  end
end
