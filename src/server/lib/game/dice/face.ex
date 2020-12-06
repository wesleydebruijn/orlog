defmodule Game.Dice.Face do
  @moduledoc """
  Face of the dice determines the action of the dice,
  when not {disabled} do {type} {stance} for {count} times with {amount}
  which will intersect with opposing faces for {intersects} times
  """
  alias Game.Dice
  alias Game.Dice.Face

  @type t :: %Face{
          count: integer(),
          amount: integer(),
          intersects: integer(),
          disabled: boolean(),
          type: :melee | :ranged | :token,
          stance: :attack | :block | :steal
        }
  @derive Jason.Encoder
  defstruct count: 1,
            amount: 1,
            intersects: 0,
            disabled: false,
            type: :melee,
            stance: :block

  @spec intersects?(Face.t(), Face.t()) :: boolean()
  def intersects?(face, other) do
    !face.disabled &&
      !other.disabled &&
      face.count - face.intersects > 0 &&
      other.count - other.intersects > 0 &&
      face.type == other.type &&
      [:block, :attack] -- [face.stance, other.stance] == []
  end

  @spec update(Dice.t(), map()) :: Dice.t()
  def update(%Dice{face: face} = dice, attrs) do
    %{dice | face: update(face, attrs)}
  end

  @spec update(Face.t(), map()) :: Face.t()
  def update(face, attrs), do: Map.merge(face, attrs)

  @spec increase(Dice.t(), atom(), integer()) :: Dice.t()
  def increase(%Dice{face: face} = dice, key, amount) do
    %{dice | face: increase(face, key, amount)}
  end

  @spec increase(Face.t(), atom(), integer()) :: Face.t()
  def increase(face, key, amount) do
    Map.put(face, key, Map.get(face, key) + amount)
  end

  @spec multiply(Dice.t(), atom(), integer()) :: Dice.t()
  def multiply(%Dice{face: face} = dice, key, amount) do
    %{dice | face: multiply(face, key, amount)}
  end

  @spec multiply(Face.t(), atom(), integer()) :: Face.t()
  def multiply(face, key, amount) do
    Map.put(face, key, Map.get(face, key) * amount)
  end

  @spec hits(Face.t()) :: integer()
  def hits(%Dice{face: face}), do: hits(face)
  def hits(%{disabled: true}), do: 0
  def hits(%{stance: :block} = face), do: face.intersects
  def hits(face), do: face.count - face.intersects

  @spec hit_amount(Dice.t()) :: integer()
  def hit_amount(%Dice{face: face}), do: hit_amount(face)

  @spec hit_amount(Face.t()) :: integer()
  def hit_amount(face), do: hits(face) * face.amount

  @spec resolve(map(), map()) :: map()
  def resolve(faces, other) do
    Enum.reduce(other, faces, &resolve_face(&2, elem(&1, 1)))
  end

  @spec resolve_face(map(), Face.t()) :: map()
  def resolve_face(faces, %{count: count} = face) when count > 1 do
    faces
    |> find_intersect(face)
    |> resolve_face(%{face | count: face.count - 1})
  end

  def resolve_face(faces, face), do: find_intersect(faces, face)

  defp find_intersect(faces, face) do
    {index, face} = Enum.find(faces, {nil, nil}, &intersects?(face, elem(&1, 1)))

    if index do
      faces
      |> Map.put(index, %{face | intersects: face.intersects + 1})
    else
      faces
    end
  end
end
