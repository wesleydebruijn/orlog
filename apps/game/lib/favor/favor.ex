defmodule Favor do
  @callback invoke(Game.t(), any()) :: Game.t()
  @callback get :: Face.t()

  @type t :: %Favor{
          trigger: :pre_resolution | :resolution | :post_resolution,
          tiers: map()
        }

  defmacro __using__(_) do
    quote do
      def buy(game, tier) do
        options = Map.get(@tiers, tier, %{cost: 0})
        player = Game.Turn.get_player(game)

        if player.tokens >= options.cost do
          game
          |> Game.Turn.update_player(&Game.Player.increase(&1, :tokens, -options.cost))
          |> invoke(options)
        else
          game
        end
      end
    end
  end
end
