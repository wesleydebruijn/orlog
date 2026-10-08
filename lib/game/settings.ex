defmodule Game.Settings do
  @moduledoc """
  Settings of the game
  """
  alias Game.Phase

  @type t :: %Game.Settings{
          health: integer(),
          tokens: integer(),
          dices: integer(),
          favors: integer(),
          phases: any()
        }
  @derive Jason.Encoder
  defstruct health: 15,
            tokens: 0,
            dices: 6,
            favors: 3,
            phases: %{
              1 => %Phase{name: "Roll", turns: 3, module: Phase.Roll},
              2 => %Phase{name: "God Favor", turns: 1, module: Phase.GodFavor},
              3 => %Phase{name: "Resolution", turns: 7, auto: true, module: Phase.Resolution}
            }
end
