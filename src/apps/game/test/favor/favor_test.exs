defmodule FavorTest do
  use ExUnit.Case
  # alias Game.Player

  # def create_game_with_tokens(tokens) do
  #   %Game{
  #     players: %{
  #       1 => %Player{
  #         tokens: tokens
  #       }
  #     },
  #     turn: 1
  #   }
  # end

  # describe "buy/2" do
  #   test "should reduce tokens by tier 1 cost" do
  #     game = create_game_with_tokens(10)
  #     actual = FavorFixture.buy(game, 1)
  #     expected = create_game_with_tokens(6)

  #     assert_received %{cost: 4}
  #     assert actual == expected
  #   end

  #   test "should reduce tokens by tier 2 cost" do
  #     game = create_game_with_tokens(10)
  #     actual = FavorFixture.buy(game, 2)
  #     expected = create_game_with_tokens(2)

  #     assert_received %{cost: 8}
  #     assert actual == expected
  #   end

  #   test "should reduce tokens by tier 3 cost" do
  #     game = create_game_with_tokens(12)
  #     actual = FavorFixture.buy(game, 3)
  #     expected = create_game_with_tokens(0)

  #     assert_received %{cost: 12}
  #     assert actual == expected
  #   end

  #   test "should not be able to buy: insufficient tokens" do
  #     game = create_game_with_tokens(4)
  #     actual = FavorFixture.buy(game, 3)
  #     expected = create_game_with_tokens(4)

  #     refute_received %{cost: 12}
  #     assert actual == expected
  #   end
  # end
end
