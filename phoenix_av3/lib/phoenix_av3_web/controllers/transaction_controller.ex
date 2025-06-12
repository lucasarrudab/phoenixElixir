defmodule PhoenixAv3Web.TransactionController do
  use PhoenixAv3Web, :controller

  alias PhoenixAv3.Finance
  alias PhoenixAv3.Finance.Transaction

  action_fallback PhoenixAv3Web.FallbackController

  def index(conn, _params) do
    transactions =
      Finance.list_transactions()
      |> Enum.map(&serialize_transaction/1)

    json(conn, %{data: transactions})
  end

  def create(conn, %{"transaction" => transaction_params}) do
    with {:ok, %Transaction{} = transaction} <- Finance.create_transaction(transaction_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/transactions/#{transaction}")
      |> json(serialize_transaction(transaction))
    end
  end

  def show(conn, %{"id" => id}) do
    transaction = Finance.get_transaction!(id)
    json(conn, serialize_transaction(transaction))
  end

  def update(conn, %{"id" => id, "transaction" => transaction_params}) do
    transaction = Finance.get_transaction!(id)

    with {:ok, %Transaction{} = transaction} <- Finance.update_transaction(transaction, transaction_params) do
      json(conn, serialize_transaction(transaction))
    end
  end

  def delete(conn, %{"id" => id}) do
    transaction = Finance.get_transaction!(id)

    with {:ok, %Transaction{}} <- Finance.delete_transaction(transaction) do
      send_resp(conn, :no_content, "")
    end
  end

  defp serialize_transaction(t) do
    %{
      id: t.id,
      data: t.data,
      descricao: t.descricao,
      valor: Decimal.to_string(t.valor),
      tipo: t.tipo,
      inserted_at: t.inserted_at,
      updated_at: t.updated_at
    }
  end
end
