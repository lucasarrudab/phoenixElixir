defmodule PhoenixAv3.Finance.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "transactions" do
    field :data, :utc_datetime
    field :descricao, :string
    field :valor, :decimal
    field :tipo, :string
    belongs_to :user, PhoenixAv3.Accounts.User
    many_to_many :tags, PhoenixAv3.Finance.Tag, join_through: "transactions_tags", on_replace: :delete
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:descricao, :valor, :tipo, :data])
    |> validate_required([:descricao, :valor, :tipo, :data])
  end

end
