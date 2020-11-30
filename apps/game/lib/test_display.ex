defmodule Game.TestDisplay do
  def display(game) do
    player1 = Map.get(game.players, 1)
    player2 = Map.get(game.players, 2)

    name = fn dice ->
      "[#{dice.face.type} #{dice.face.stance}#{if dice.tokens == 1, do: "*", else: ""}]#{
        if dice.keep, do: "!", else: ""
      }#{if dice.locked, do: "!", else: ""}"
    end

    resolution = fn player, stance, type ->
      player.dices
      |> Game.Dice.faces()
      |> Map.values()
      |> Enum.filter(fn face -> face.stance == stance && face.type == type end)
      |> Enum.map(fn face ->
        "#{face.intersects}/#{face.count} blocked"
      end)
      |> Enum.join(" - ")
    end

    IO.puts("-----------------------------------------------------------")
    IO.puts("round: #{game.round}, phase: #{game.phase}")
    IO.puts("-----------------------------------------------------------")

    IO.puts(
      "player 1: #{player1.user}, health: #{player1.health}, tokens: #{player1.tokens}, turns: #{
        player1.turns
      }#{if game.turn == 1, do: "*", else: ""}"
    )

    IO.puts(
      "player 2: #{player2.user}, health: #{player2.health}, tokens: #{player2.tokens}, turns: #{
        player2.turns
      }#{if game.turn == 2, do: "*", else: ""}"
    )

    IO.puts("-----------------------------------------------------------")

    IO.puts(
      "player1 dices: #{player1.dices |> Enum.map(&name.(elem(&1, 1))) |> Enum.join(" - ")}"
    )

    IO.puts(
      "player2 dices: #{player2.dices |> Enum.map(&name.(elem(&1, 1))) |> Enum.join(" - ")}"
    )

    IO.puts("-----------------------------------------------------------")

    IO.puts("player1 resolution:")
    IO.puts("melee attack: " <> resolution.(player1, :attack, :melee))
    IO.puts("ranged attack: " <> resolution.(player1, :attack, :ranged))
    IO.puts("melee block: " <> resolution.(player1, :block, :melee))
    IO.puts("ranged block: " <> resolution.(player1, :block, :ranged))
    IO.puts("token steal: " <> resolution.(player1, :steal, :token))

    IO.puts("-----------------------------------------------------------")

    IO.puts("player2 resolution:")
    IO.puts("melee attack: " <> resolution.(player2, :attack, :melee))
    IO.puts("ranged attack: " <> resolution.(player2, :attack, :ranged))
    IO.puts("melee block: " <> resolution.(player2, :block, :melee))
    IO.puts("ranged block: " <> resolution.(player2, :block, :ranged))
    IO.puts("token steal: " <> resolution.(player2, :steal, :token))

    IO.puts("-----------------------------------------------------------")

    nil
  end
end
