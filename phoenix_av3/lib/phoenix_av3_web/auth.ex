defmodule PhoenixAv3Web.Auth do
  import Plug.Conn
  alias Joken.Signer

  def init(opts), do: opts

  def call(conn, _opts) do
    with ["Bearer " <> token] <- get_req_header(conn, "authorization"),
         signer <- Signer.create("HS256", "ADSUHHUD1273FHSUD3H222R7FSDBYF237V"),
         {:ok, claims} <- PhoenixAv3Web.Token.verify_and_validate(token, signer) do
      assign(conn, :current_user_id, claims["sub"])
    else
      _ ->
        conn
        |> send_resp(:unauthorized, "Acesso não autorizado")
        |> halt()
    end
  end
end
