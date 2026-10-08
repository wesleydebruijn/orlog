import Config

config :orlog, OrlogWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  server: false

config :logger, level: :warning

config :orlog,
  favors: %{
    1 => %{
      name: "Fake Favor",
      affects: :any,
      trigger: :pre_favor,
      invoke: &Game.FakeAction.invoke/2,
      tiers: %{
        1 => %{cost: 4, value: 1},
        2 => %{cost: 6, value: 2},
        3 => %{cost: 8, value: 3}
      }
    }
  }
