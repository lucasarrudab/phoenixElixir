defmodule PhoenixAv3.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :nome, :string
    field :email, :string
    field :senha, :string
    has_many :transactions, PhoenixAv3.Finance.Transaction
    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:nome, :email, :senha])
    |> validate_required([:nome, :email, :senha])
  end
end
