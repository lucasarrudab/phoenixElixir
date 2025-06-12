defmodule PhoenixAv3Web.TransactionJSON do
  alias PhoenixAv3.Finance.Transaction

  @doc """
  Renders a list of transactions.
  """
  def index(%{transactions: transactions}) do
    %{data: for(transaction <- transactions, do: data(transaction))}
  end

  @doc """
  Renders a single transaction.
  """
  def show(%{transaction: transaction}) do
    %{data: data(transaction)}
  end

  defp data(%Transaction{} = transaction) do
    %{
      id: transaction.id,
      data: transaction.data,
      descricao: transaction.descricao,
      valor: transaction.valor,
      tipo: transaction.tipo
    }
  end
end
