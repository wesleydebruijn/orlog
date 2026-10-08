defmodule UserTest do
  use ExUnit.Case, async: true

  test "update/2 ignores name changes" do
    user = User.new("abc")
    updated = User.update(user, %{"name" => "Hacker", "ready" => true})

    assert updated.name == user.name
    assert updated.ready
  end
end
