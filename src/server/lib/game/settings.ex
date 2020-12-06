defmodule Game.Settings do
  @moduledoc """
  Settings of the game
  """
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
              1 => %{module: Game.Phase.Roll, name: "Roll phase", turns: 3},
              2 => %{module: Game.Phase.GodFavor, name: "God Favor phase", turns: 1},
              3 => %{module: Game.Phase.Resolution, name: "Resolution phase", turns: 7}
            }
end
