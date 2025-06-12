defmodule PhoenixAv3.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :nome, :string
      add :email, :string
      add :senha, :string

      timestamps(type: :utc_datetime)
    end
  end
end
