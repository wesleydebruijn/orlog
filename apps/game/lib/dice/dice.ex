defmodule Game.Dice do
  @moduledoc """
  Dice
  """
  alias Game.Dice

  @faces [
    Dice.Face.MeleeAttack.get(),
    Dice.Face.MeleeBlock.get(),
    Dice.Face.RangedAttack.get(),
    Dice.Face.RangedBlock.get(),
    Dice.Face.TokenSteal.get()
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
  def unlock(dice), do: %{dice | locked: false}

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
