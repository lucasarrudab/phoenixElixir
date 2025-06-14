defmodule PhoenixAv3Web.Token do
  use Joken.Config

  def token_config do
    default_claims()
  end

  def generate(user) do
    claims = %{
      "sub" => to_string(user.id),
      "email" => user.email
    }

    signer = Joken.Signer.create("HS256", "ADSUHHUD1273FHSUD3H222R7FSDBYF237V")

    {:ok, token, _claims} = generate_and_sign(claims, signer)
    token
  end
end
