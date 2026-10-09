# AGENTS.md

Orlog is a two-player, browser-based clone of the Viking dice game. It is a single
Phoenix app: game logic in Elixir, a vanilla JS + Three.js client. No database; games
live in memory. See `README.md` for the rules and how to run it.

## Layout

- `lib/game/`: pure game logic (phases, rounds, turns, dice, favors, actions).
  `lib/game/lobby/` holds the GenServer per game.
- `lib/orlog_web/`: Phoenix endpoint, router, pages and the JSON websocket
  (`game_socket.ex`) at `/ws/:game_id/:user_id`.
- `lib/user/`: user store and name generator.
- `config/config.exs`: the 19 god favors and their tiers. Change favor balance here.
- `assets/js/orlog/`: client modules. `assets/vendor/` is vendored third-party code;
  do not edit it.
- `test/`: ExUnit tests mirroring `lib/`. `test/support/fake_action.ex` is a test helper.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the process tree, the websocket
protocol, how phases and turns advance, and the client modules. When you change a game
action or the shape of the lobby JSON, update `GameSocket`, `connection.js` and
`state.js` together.

## Commands

```sh
mix deps.get          # install dependencies
mix phx.server        # run at http://localhost:4000
mix test              # run the test suite (about 1 second)
mix assets.build      # bundle JS/CSS with esbuild
mix format            # format Elixir code
```

Requires Elixir 1.20 and Erlang/OTP 28.

## Testing rules

- **Always run `mix test` before saying a task is done**, and report the result.
  Any change under `lib/`, `config/`, `test/` or `mix.exs` requires it.
- Add or update tests in `test/` for any game logic change. New modules in
  `lib/game/...` get a matching `test/game/..._test.exs`.
- Run a single file or test while iterating: `mix test test/game/round_test.exs` or
  `mix test test/game/round_test.exs:42`. Finish with the full suite.
- If a test fails, fix the code or the test for a real reason. Never delete, skip
  (`@tag :skip`) or weaken a test just to get green.
- For JS changes, also run `mix assets.build` to confirm the bundle compiles. There
  are no JS tests.
- Don't introduce a database, Node/npm or new dependencies without asking.

## Guardrails

`.cursor/hooks.json` registers a `stop` hook (`.cursor/hooks/run-tests.sh`). When the
agent finishes, it runs `mix test`. If tests fail, the output is sent back to the
agent as a follow-up (at most 3 times). Treat that as a failing gate: keep going
until the suite passes. The hook needs `mix` and `jq` on the `PATH`.

## Conventions

- Match the existing Elixir style; format files you touch with `mix format`.
  (The repo isn't fully formatted yet, so don't reformat unrelated files.)
- Keep game rules in `lib/game` free of web concerns; the websocket layer only
  translates messages to and from `Game.Lobby`.
- CI (`.github/workflows/test.yml`) runs `mix assets.build` and `mix test` on pushes
  and PRs to `main`. Keep both green.
