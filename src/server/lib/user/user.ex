defmodule User do
  @moduledoc """
  User
  """
  @type t :: %User{
          uuid: String.t(),
          name: String.t(),
          title: String.t(),
          favors: list(),
          ready: boolean()
        }
  @derive {Jason.Encoder, except: [:uuid]}
  defstruct uuid: nil, name: nil, title: nil, favors: [], ready: false

  @spec new(String.t()) :: User.t()
  def new(uuid) do
    %User{
      uuid: uuid,
      name: User.NameGenerator.generate(),
      title: "Drang"
    }
  end

  def update(user, attrs) do
    user
    |> Map.put(:favors, Map.get(attrs, "favors", user.favors))
    |> Map.put(:name, Map.get(attrs, "name", user.name))
    |> Map.put(:ready, Map.get(attrs, "ready", user.ready))
  end
end
