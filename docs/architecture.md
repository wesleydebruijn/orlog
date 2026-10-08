# Architecture

## Processes

`Orlog` (`lib/application.ex`) supervises `Phoenix.PubSub`, `User.Store`,
`Game.Lobby.Supervisor` and `OrlogWeb.Endpoint`.

- `User.Store`: a public, named ETS table (`:users`) keyed by the user id the browser
  sends. Users are created on first connect and updated in place, and are lost on restart.
- `Game.Lobby.Supervisor`: a `DynamicSupervisor` with one `Game.Lobby.Server` per game.
  `find_or_initialize/1` starts the server or returns the one already running, so a game
  exists as soon as someone opens its URL. The server is registered under
  `String.to_atom(game_id)`, which is why `SocketController` restricts ids to 64 safe
  characters.
- `Game.Lobby.Server`: a GenServer that holds a `%Game.Lobby{}` and serialises every
  change to it. It keeps no rules of its own; it calls the pure functions in
  `Game.Lobby` and `Game`. It stops 2 minutes after the last player leaves.

## Request flow

1. `GET /game/:id` (`PageController.game`) renders the page with the game id and the
   favor catalogue from `config.exs` as JSON in data attributes.
2. The client opens `/ws/:game_id/:user_id`. `SocketController` validates both ids and
   upgrades to `OrlogWeb.GameSocket` (a plain `WebSock` handler, not a Phoenix Channel).
3. `GameSocket.init` loads the user, finds the lobby and joins it, or closes with
   `"Lobby is full"` once two players are in.
4. Incoming JSON `{type, value}` messages map one-to-one to `Game.Lobby.Server` calls:
   `continue`, `toggleDice` and `selectFavor` become game actions (`:continue`,
   `{:toggle, i}`, `{:select, %{favor, tier}}`); `changeSettings`, `toggleReady` and
   `updateUser` change the lobby.
5. The server never sends diffs. After every change it sends the full `%Game.Lobby{}`
   to each joined socket process (`notify_pids`), and the socket also replies to the
   sender. `GameSocket.encode!/1` adds the receiver's `turn` (seat 1 or 2) and `user`
   before encoding. Opponent state is not hidden.

## Game model (`lib/game`)

Everything here is pure: functions take a `%Game{}` and return a new one.

- `Game.Lobby` handles the pre-game state: joining, settings, ready flags, starting
  (`status` goes `:creating -> :waiting -> :playing -> :finished`) and auto-turn timing.
  Two ready players start a `Game` via `Game.start/2`. A finished game toggles everyone
  back to not ready, so readying again is a rematch.
- `%Game{}` holds `settings`, `players`, `round`, `phase`, `turn`, `start` and `winner`.
  Players (and each player's dice) are maps keyed by 1-based index; `IndexMap` is the
  helper for reading and updating them.
- `Game.Settings.phases` lists the phases in order: `1` Roll (3 turns), `2` God Favor
  (1 turn, skipped in round 1), `3` Resolution (7 turns, `auto: true`). Each phase
  module implements the `Game.Phase` behaviour, a single `action(game, action)`.
- `Game.invoke/2` dispatches an action to the current phase's module. The game moves
  forward through lifecycle actions that the phases send themselves: `Turn.next`
  invokes `:end_turn`, switches player, calls `Phase.try_next`, then invokes
  `:start_turn`. `Phase.next` (once every player's `turns` reach 0) invokes
  `:end_phase`, maybe advances the round, then invokes `:start_phase` on the next phase.
- `Game.Phase.Resolution` uses the player's remaining `turns` (7 down to 1) as a step
  counter: opponent pre-resolution favor, own pre-resolution favor, resolve dice against
  each other, attack, steal tokens, then the two post-resolution favors. `:end_phase`
  sets `winner` when a player's health reaches 0.
- Because Resolution is `auto`, the server schedules `:continue` itself after
  `Game.Lobby.auto_turn_delay/1`. The attack and steal steps get one beat per die so the
  client's animation (`faceoff.js`) has time to play, and there is only ever one pending
  timer, so a player pressing continue early doesn't skip a step.
- `Game.Action.*` (attack, block, heal, token, dice) are the effects. Resolution calls
  them directly and god favors call them through `invoke`.
- God favors are data in `config/config.exs`: `trigger`
  (`:pre_resolution | :post_resolution | :pre_favor | :post_favor`), `affects`,
  per-tier `cost`/`value`, and `invoke`, a captured `Game.Action` function called as
  `invoke.(game, value)`. `Game.Player` reads them with `Application.compile_env`, so
  a config change means a recompile. `Game.Favor.invoke/3` pays the cost and runs the
  opponent's `:pre_favor`/`:post_favor` reactions around the favor itself.

## Client (`assets/js`)

No framework. esbuild bundles `app.js`; Three.js and cannon-es (dice physics) are
vendored in `assets/vendor/`.

- `app.js` boots either the home page (new game means a random uuid in the URL) or the
  game page, and connects the modules below. All state flows one way: server state goes
  into `buildModel`, then `table.update` and `hud.update`.
- `connection.js`: the websocket. The user id comes from `localStorage` (`?user=<id>`
  overrides it, so you can play yourself in two tabs). Duplicate frames are skipped, it
  reconnects with backoff, and it has one method per message type.
- `state.js`: turns the raw lobby JSON into a view model (seat, phase, resolution step,
  dice layout). Its `PHASE`/`STEP` constants must match `Game.Settings` and
  `Game.Phase.Resolution`.
- `scene.js`, `table.js`, `dice.js`, `faceoff.js`, `favors.js`, `stones.js`,
  `tokens.js`, `textures.js`, `icons.js`: the Three.js scene. Every texture is drawn on
  a canvas at runtime; the only image assets are the background images.
- `hud.js` (in-game overlay), `lobby.js` (pre-game screens: settings, favor pick,
  invite) and `picking.js` (raycast clicks on dice and plaques).

The client only sends intents; the server checks whose turn it is (`Game.Lobby.turn?`)
and ignores actions from the other player. When you change a game action or the shape
of the lobby JSON, update `GameSocket`, `connection.js` and `state.js` together.
