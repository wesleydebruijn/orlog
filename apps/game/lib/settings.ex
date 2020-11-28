defmodule Game.Settings do
  @moduledoc """
  Settings of the game
  """

  @type t :: %Game.Settings{
    health: integer(),
    tokens: integer(),
    rolls: integer(),
    dices: integer()
  }
  defstruct health: 0, tokens: 0, rolls: 0, dices: 0
end
