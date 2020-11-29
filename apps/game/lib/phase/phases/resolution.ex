defmodule Game.Phase.Resolution do
  @moduledoc """
  Resolution phase
  """
  @behaviour Game.Phase

  alias Game.{
    Player,
    Phase
  }

  @impl Game.Phase
  @spec action(Game.t(), any()) :: Game.t()
  def action(game, :start_phase) do
    %{turns: turns} = Phase.current(game)

    game
    |> Game.update_players(&Player.update(&1, %{turns: turns}))
  end

  def action(game, :end_turn) do
    opponent = Game.opponent_player(game)

    player =
      game
      |> Game.current_player()
      |> Player.update_turns(-1)
      |> Player.collect_tokens()
      |> Player.resolve(opponent)

    Game.update_current_player(game, player)
    # TODO: buy & apply pre-phase godfavor effects
  end

  def action(game, :resolve) do
    # |> Game.update_players(&Player.collect_on_hit/1)
    # |> Game.update_players(&Player.collect_on_block/1)
    # TODO: buy & apply post-phase godfavor effects
    game
  end

  def action(game, :end_phase) do
    game
  end

  def action(game, _other) do
    # unknown action
    game
  end
end
