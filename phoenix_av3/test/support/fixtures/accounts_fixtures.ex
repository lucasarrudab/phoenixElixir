defmodule PhoenixAv3.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `PhoenixAv3.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        nome: "some nome",
        senha: "some senha"
      })
      |> PhoenixAv3.Accounts.create_user()

    user
  end
end
