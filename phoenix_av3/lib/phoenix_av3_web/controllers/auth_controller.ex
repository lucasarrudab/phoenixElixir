defmodule PhoenixAv3Web.AuthController do
  use PhoenixAv3Web, :controller

  alias PhoenixAv3.Accounts
  alias PhoenixAv3.Accounts.User
  alias PhoenixAv3Web.Token

  def register(conn, %{"nome" => nome, "email" => email, "senha" => senha}) do
    case Accounts.create_user(%{"nome" => nome, "email" => email, "senha" => senha}) do
      {:ok, user} ->
        token = Token.generate(user)
        json(conn, %{user: %{id: user.id, nome: user.nome, email: user.email}, token: token})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: changeset})
    end
  end

  def login(conn, %{"email" => email, "senha" => senha}) do
    user = Accounts.get_user_by_email(email)

    cond do
      user && user.senha == senha ->
        token = Token.generate(user)
        json(conn, %{user: %{id: user.id, nome: user.nome, email: user.email}, token: token})

      true ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Credenciais inválidas"})
    end
  end
end
