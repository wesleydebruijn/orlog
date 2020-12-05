defmodule Orlog.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "apps",
      version: "0.1.0",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      consolidate_protocols: Mix.env() != :test,
      releases: [
        api: [
          include_executables_for: [:unix],
          applications: [api: :permanent, runtime_tools: :permanent]
        ]
      ]
    ]
  end

  defp deps do
    []
  end
end
