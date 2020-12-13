defmodule User do
  @moduledoc """
  User
  """
  @type t :: %User{
          uuid: String.t(),
          name: String.t(),
          title: String.t()
        }
  @derive {Jason.Encoder, except: [:uuid]}
  defstruct uuid: nil, name: nil, title: nil

  @spec new(String.t()) :: User.t()
  def new(uuid) do
    %User{
      uuid: uuid,
      name: User.NameGenerator.generate(),
      title: "Drang"
    }
  end
end
