# Orlog

A two-player, browser-based clone of Orlog, the Viking dice game from Assassin's Creed: Valhalla.
Players roll dice on a 3D table, spend tokens on the favor of the Norse gods, and try to
reduce each other's health to zero.

## How it works

Everything lives in a single Phoenix app:

- **Game logic** (`lib/game`): rules, phases, dice and god favors, written in Elixir.
  Each game is a lobby process (`Game.Lobby`) kept in memory.
- **Web server** (`lib/orlog_web`): serves the pages and a JSON websocket at
  `/ws/:game_id/:user_id`, which the client uses to talk to the lobby.
- **Client** (`assets`): vanilla JS with Three.js and cannon-es for the 3D table and
  physics. Both are vendored in `assets/vendor` and bundled by Phoenix's esbuild, so
  there is no Node/npm step.

There is no database. Restarting the server drops all games.

### Rules in short

Each player starts with 15 health and 6 dice. A round has three phases:

1. **Roll**: each player rolls up to 3 times, keeping dice between rolls.
2. **God Favor**: players may spend tokens (earned from dice) on one of 3 chosen
   favors, at tier 1, 2 or 3, which has a higher cost and a stronger effect.
3. **Resolution**: dice are compared in turn. Attacks are blocked by matching
   blocks (melee vs. melee, ranged vs. ranged), and unblocked attacks deal damage.

Rounds repeat until one player runs out of health. The 17 god favors are defined
in `config/config.exs`.

## Requirements

- Elixir 1.20 and Erlang/OTP 28 (see `mix.exs` and `.github/workflows/test.yml`)

## Running locally

```sh
mix deps.get
mix phx.server
```

Then open http://localhost:4000 and press **New game**. Share the game URL
(`/game/<id>`) with your opponent.

The dev server downloads esbuild on first run, then rebuilds assets and reloads the
browser when files change.

### Playing against yourself

Your player id is stored in `localStorage`, so two tabs in the same browser would be
the same player. Override the id in one of them with `?user=<id>`:

- http://localhost:4000/game/demo?user=alice
- http://localhost:4000/game/demo?user=bob

## Tests

```sh
mix test
```

Tests cover the game logic (`test/game`). CI (`.github/workflows/test.yml`) runs
`mix assets.build` and `mix test` on every push and pull request to `main`.

## Docker

The Dockerfile builds a production release with minified assets.

```sh
docker build -t orlog .
docker run -p 4000:4000 -e SECRET_KEY_BASE=$(mix phx.gen.secret) orlog
```

Configuration (read in `config/runtime.exs`):

| Variable          | Default     | Description                                          |
| ----------------- | ----------- | ---------------------------------------------------- |
| `PORT`            | `4000`      | Port the server listens on                           |
| `PHX_HOST`        | `orlog.app` | Public hostname used for generated URLs              |
| `SECRET_KEY_BASE` | random      | Secret for signing; set it to keep it stable on restart |
