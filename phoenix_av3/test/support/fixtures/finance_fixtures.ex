defmodule PhoenixAv3.FinanceFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `PhoenixAv3.Finance` context.
  """

  @doc """
  Generate a tag.
  """
  def tag_fixture(attrs \\ %{}) do
    {:ok, tag} =
      attrs
      |> Enum.into(%{
        nome: "some nome"
      })
      |> PhoenixAv3.Finance.create_tag()

    tag
  end

  @doc """
  Generate a transaction.
  """
  def transaction_fixture(attrs \\ %{}) do
    {:ok, transaction} =
      attrs
      |> Enum.into(%{
        data: ~U[2025-06-07 18:25:00Z],
        descricao: "some descricao",
        tipo: "some tipo",
        valor: "120.5"
      })
      |> PhoenixAv3.Finance.create_transaction()

    transaction
  end
end
