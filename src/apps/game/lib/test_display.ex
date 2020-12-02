defmodule Game.TestDisplay do
  def display(game) do
    IO.puts(IO.ANSI.clear())

    player1 = Map.get(game.players, 1)
    player2 = Map.get(game.players, 2)

    player = fn p ->
      "name: #{p.user}, health: #{p.health}, tokens: #{p.tokens}, turns #{p.turns}"
    end

    dices = fn player, keep ->
      player.dices
      |> IndexMap.filter(fn dice -> dice.keep == keep end)
      |> Enum.map(fn {_index, dice} ->
        "#{dice.face.type} #{dice.face.stance}#{if dice.tokens == 1, do: "*", else: ""}"
      end)
      |> Enum.join(" - ")
    end

    resolution = fn player, stance, type ->
      player.dices
      |> IndexMap.dig(:face)
      |> Map.values()
      |> Enum.filter(fn face -> face.stance == stance && face.type == type end)
      |> Enum.map(fn face ->
        "#{face.type} #{face.stance}"
      end)
      |> Enum.join(" - ")
    end

    IO.puts("-----------------------------------------------------------")
    IO.puts("round: #{game.round}, phase: #{game.phase}, turn: player#{game.turn}")
    IO.puts("-----------------------------------------------------------")
    IO.puts(player.(player1))
    IO.puts(player.(player2))
    IO.puts("-----------------------------------------------------------")
    IO.puts("player1 dices")
    IO.puts("-----------------------------------------------------------")
    IO.puts(dices.(player1, true))
    IO.puts(dices.(player1, false))
    IO.puts("-----------------------------------------------------------")
    IO.puts("player2 dices")
    IO.puts("-----------------------------------------------------------")
    IO.puts(dices.(player2, true))
    IO.puts(dices.(player2, false))
    IO.puts("-----------------------------------------------------------")
    IO.puts("player1 attack")
    IO.puts("-----------------------------------------------------------")
    IO.puts(resolution.(player2, :block, :melee))
    IO.puts(resolution.(player1, :attack, :melee))
    IO.puts("-----------------------------------------------------------")
    IO.puts(resolution.(player2, :block, :ranged))
    IO.puts(resolution.(player1, :attack, :ranged))
    IO.puts("-----------------------------------------------------------")
    IO.puts("player2 attack")
    IO.puts("-----------------------------------------------------------")
    IO.puts(resolution.(player1, :block, :melee))
    IO.puts(resolution.(player2, :attack, :melee))
    IO.puts("-----------------------------------------------------------")
    IO.puts(resolution.(player1, :block, :ranged))
    IO.puts(resolution.(player2, :attack, :ranged))
    IO.puts("-----------------------------------------------------------")
    IO.puts("player1 steal")
    IO.puts("-----------------------------------------------------------")
    IO.puts(resolution.(player1, :steal, :token))
    IO.puts("-----------------------------------------------------------")
    IO.puts("player2 steal")
    IO.puts("-----------------------------------------------------------")
    IO.puts(resolution.(player2, :steal, :token))
    IO.puts("-----------------------------------------------------------")

    nil
  end
end
