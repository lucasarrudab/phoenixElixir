defmodule PhoenixAv3Web.OptionsController do
  use PhoenixAv3Web, :controller

  def options(conn, _params) do
    conn
    |> put_resp_header("access-control-allow-origin", "http://localhost:3000")
    |> put_resp_header("access-control-allow-methods", "GET,POST,PUT,DELETE,OPTIONS")
    |> put_resp_header("access-control-allow-headers", "content-type,authorization")
    |> send_resp(204, "")
  end
end
