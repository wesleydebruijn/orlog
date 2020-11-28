defmodule Game.Round do
  @moduledoc """
  Round
  """
  @type t :: %Game{
    players: [Game.Player.t()],
  }
  defstruct players: []
end
