defmodule PhoenixAv3Web.TagController do
  use PhoenixAv3Web, :controller

  alias PhoenixAv3.Finance
  alias PhoenixAv3.Finance.Tag

  action_fallback PhoenixAv3Web.FallbackController

  def index(conn, _params) do
    tags = Finance.list_tags()
    render(conn, :index, tags: tags)
  end

  def create(conn, %{"tag" => tag_params}) do
    with {:ok, %Tag{} = tag} <- Finance.create_tag(tag_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/tags/#{tag}")
      |> render(:show, tag: tag)
    end
  end

  def show(conn, %{"id" => id}) do
    tag = Finance.get_tag!(id)
    render(conn, :show, tag: tag)
  end

  def update(conn, %{"id" => id, "tag" => tag_params}) do
    tag = Finance.get_tag!(id)

    with {:ok, %Tag{} = tag} <- Finance.update_tag(tag, tag_params) do
      render(conn, :show, tag: tag)
    end
  end

  def delete(conn, %{"id" => id}) do
    tag = Finance.get_tag!(id)

    with {:ok, %Tag{}} <- Finance.delete_tag(tag) do
      send_resp(conn, :no_content, "")
    end
  end
end
