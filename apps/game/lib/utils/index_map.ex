defmodule IndexMap do
  @moduledoc """
  Index based Map
  """

  @spec get(map(), integer) :: any()
  def get(items, index) do
    Map.get(items, index)
  end

  @spec dig(any(), atom()) :: any()
  def dig(items, key) do
    Enum.into(items, %{}, fn {index, item} -> {index, Map.get(item, key)} end)
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

  @spec filter(any(), fun()) :: [any()]
  def filter(items, fun) do
    Enum.filter(items, fn {_index, item} -> fun.(item) end)
  end

  @spec sum(any(), fun()) :: number
  def sum(items, fun) do
    items
    |> Enum.map(fn {_index, item} -> fun.(item) end)
    |> Enum.sum()
  end

  @spec take(any(), integer()) :: [any()]
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

  @spec majority(map(), fun()) :: [any()]
  def majority(items, fun) do
    items
    |> Enum.group_by(fn {_index, item} -> fun.(item) end)
    |> Enum.max_by(fn {_group, items} -> Enum.count(items) end)
    |> elem(1)
  end

  @spec add(map(), list()) :: map()
  def add(items, values) do
    from =
      items
      |> Map.keys()
      |> Enum.max(&>=/2, fn -> 0 end)
      |> Kernel.+(1)

    to = from + Enum.count(values) - 1

    from..to
    |> Enum.into(%{}, fn index -> {index, Enum.at(values, index - from)} end)
    |> Map.merge(items)
  end
end
