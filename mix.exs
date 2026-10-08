defmodule Orlog.MixProject do
  use Mix.Project

  def project do
    [
      app: :orlog,
      version: "0.1.0",
      elixir: "~> 1.20",
      start_permanent: Mix.env() == :prod,
      elixirc_paths: elixirc_paths(Mix.env()),
      consolidate_protocols: Mix.env() != :test,
      aliases: aliases(),
      deps: deps(),
      listeners: [Phoenix.CodeReloader]
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {Orlog, []},
      extra_applications: [:logger]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_env), do: ["lib"]

  defp deps do
    [
      {:phoenix, "~> 1.8"},
      {:phoenix_html, "~> 4.1"},
      # Only for HEEx templates; the game itself talks over its own websocket
      {:phoenix_live_view, "~> 1.1"},
      {:phoenix_live_reload, "~> 1.5", only: :dev},
      {:bandit, "~> 1.5"},
      {:websock_adapter, "~> 0.5"},
      {:esbuild, "~> 0.9", runtime: Mix.env() == :dev},
      {:plug, "~> 1.11"},
      {:jason, "~> 1.2"}
    ]
  end

  defp aliases do
    [
      "assets.build": ["esbuild orlog"],
      "assets.deploy": ["esbuild orlog --minify", "phx.digest"]
    ]
  end
end
