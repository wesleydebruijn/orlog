defmodule OrlogWeb.PageController do
  use OrlogWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end

  def game(conn, %{"id" => id}) do
    render(conn, :game, game_id: id, favors_json: favors_json())
  end

  @doc """
  The favor catalogue as JSON, keyed by favor index. The client needs it to render
  the plaques, the favor picker, and the tier costs.
  """
  def favors_json do
    :orlog
    |> Application.get_env(:favors)
    |> Enum.into(%{}, fn {index, favor} ->
      {index,
       %{
         name: favor.name,
         description: Map.get(favor, :description, ""),
         tier_description: Map.get(favor, :tier_description, ""),
         tiers: favor.tiers
       }}
    end)
    |> Jason.encode!()
  end
end
