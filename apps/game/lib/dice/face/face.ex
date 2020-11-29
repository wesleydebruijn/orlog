defmodule Game.Dice.Face do
  @moduledoc """
  Behaviour of a dice face

  when not {disabled} do {type} {stance} for {count} times with {amount}
  and gain extra {health} and {tokens} for every successful {type} {stance}
  """
  alias Game.Dice.Face

  @callback get :: Face.t()

  @type t :: %Face{
          count: integer(),
          amount: integer(),
          intersects: integer(),
          health: integer(),
          tokens: integer(),
          disabled: boolean(),
          type: :melee | :ranged | :token,
          stance: :attack | :block | :steal
        }
  defstruct count: 1,
            amount: 1,
            intersects: 0,
            health: 0,
            tokens: 0,
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

  def resolve_face(faces, face) do
    find_intersect(faces, face)
  end

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
