defmodule Game.Dice do
  @moduledoc """
  A dice can be rolled during a game by a player,
  the player can decide to {keep} the dice to retain its {face}
  before its gonna be {locked} in
  """
  alias Game.Dice

  @faces [
    %Dice.Face{type: :melee, stance: :attack},
    %Dice.Face{type: :melee, stance: :block},
    %Dice.Face{type: :ranged, stance: :attack},
    %Dice.Face{type: :ranged, stance: :block},
    %Dice.Face{type: :token, stance: :steal}
  ]

  @type t :: %Dice{
          face: Dice.Face.t(),
          tokens: integer(),
          locked: boolean(),
          keep: boolean()
        }
  defstruct face: %Dice.Face{}, tokens: 0, locked: false, keep: false

  @spec create(integer()) :: map()
  def create(amount) do
    Enum.into(1..amount, %{}, fn index -> {index, %Dice{}} end)
  end

  @spec roll(Dice.t()) :: Dice.t()
  def roll(%{keep: true} = dice), do: dice

  def roll(dice) do
    %{dice | face: Enum.random(@faces), tokens: Enum.random(0..1)}
  end

  @spec keep(Dice.t()) :: Dice.t()
  def keep(dice), do: %{dice | keep: true}

  @spec swap(Dice.t()) :: Dice.t()
  def swap(%{locked: true} = dice), do: dice
  def swap(dice), do: %{dice | keep: !dice.keep}

  @spec lock(Dice.t()) :: Dice.t()
  def lock(%{keep: false} = dice), do: dice
  def lock(dice), do: %{dice | locked: true}

  @spec unlock(Dice.t()) :: Dice.t()
  def unlock(dice), do: %{dice | keep: false, locked: false}

  @spec faces(map()) :: map()
  def faces(dices) do
    Enum.into(dices, %{}, fn {index, dice} -> {index, dice.face} end)
  end

  @spec resolve(map(), map()) :: map()
  def resolve(dices, other_dices) do
    faces =
      dices
      |> faces()
      |> Dice.Face.resolve(faces(other_dices))

    dices
    |> Enum.into(%{}, fn {index, dice} ->
      {index, %{dice | face: Map.get(faces, index)}}
    end)
  end
end
