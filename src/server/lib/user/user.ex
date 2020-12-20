defmodule User do
  @moduledoc """
  User
  """
  @type t :: %User{
          uuid: String.t(),
          name: String.t(),
          title: String.t(),
          favors: list()
        }
  @derive {Jason.Encoder, except: [:uuid]}
  defstruct uuid: nil, name: nil, title: nil, favors: []

  @spec new(String.t()) :: User.t()
  def new(uuid) do
    %User{
      uuid: uuid,
      name: User.NameGenerator.generate(),
      title: "Drang"
    }
  end

  def update(user, attrs), do: Map.merge(user, attrs)
end
