defmodule IndexMap do
  @moduledoc """
  Index based Map
  """

  @spec get(map(), integer) :: any()
  def get(items, index) do
    Map.get(items, index)
  end

  @spec update(map(), atom(), integer(), fun()) :: map()
  def update(source, key, index, fun) do
    item =
      source
      |> Map.get(key)
      |> Map.get(index)
      |> fun.()

    source
    |> Map.put(
      key,
      source
      |> Map.get(key)
      |> Map.put(index, item)
    )
  end

  @spec update_all(map(), atom(), fun()) :: map()
  def update_all(source, key, fun) do
    items =
      source
      |> Map.get(key)
      |> Enum.into(%{}, fn {index, item} -> {index, fun.(item)} end)

    Map.put(source, key, items)
  end

  @spec update_in(list(), map(), atom(), fun()) :: map()
  def update_in(items, source, key, fun) do
    items
    |> Enum.reduce(source, fn {index, _item}, acc ->
      update(acc, key, index, fun)
    end)
  end

  @spec filter(map(), fun()) :: [any()]
  def filter(items, fun) do
    Enum.filter(items, fn {_index, item} -> fun.(item) end)
  end

  @spec sum(map(), fun()) :: number
  def sum(items, fun) do
    items
    |> Enum.map(fn {_index, item} -> fun.(item) end)
    |> Enum.sum()
  end

  @spec take(map(), integer()) :: [any()]
  def take(items, amount) do
    Enum.take(items, amount)
  end

  @spec take_random(map(), integer()) :: [any()]
  def take_random(items, amount) do
    indices =
      1..amount
      |> Enum.reduce([], fn _index, acc ->
        random = Enum.to_list(1..Enum.count(items))
        acc ++ [Enum.random(random -- acc)]
      end)

    items
    |> Enum.filter(fn {index, _item} -> Enum.member?(indices, index) end)
  end
end
