defmodule PhoenixAv3.Finance.Tag do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tags" do
    field :nome, :string
    many_to_many :transactions, PhoenixAv3.Finance.Transaction, join_through: "transactions_tags", on_replace: :delete
    belongs_to :user, PhoenixAv3.Accounts.User
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(tag, attrs) do
    tag
    |> cast(attrs, [:nome])
    |> validate_required([:nome])
  end
end
