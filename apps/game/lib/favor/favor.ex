defmodule Favor do
  @callback invoke(Game.t(), any()) :: Game.t()

  defmacro __using__(_) do
    quote do
      def buy(game, tier) do
        options = Map.get(@tiers, tier, %{cost: 0})
        player = Game.current_player(game)

        if player.tokens >= options.cost do
          current_player = Game.Player.update_tokens(player, -options.cost)

          game
          |> Game.update_current_player(current_player)
          |> invoke(options)
        else
          game
        end
      end
    end
  end
end
