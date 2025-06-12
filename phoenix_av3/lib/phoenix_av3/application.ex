defmodule PhoenixAv3.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      PhoenixAv3Web.Telemetry,
      PhoenixAv3.Repo,
      {DNSCluster, query: Application.get_env(:phoenix_av3, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: PhoenixAv3.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: PhoenixAv3.Finch},
      # Start a worker by calling: PhoenixAv3.Worker.start_link(arg)
      # {PhoenixAv3.Worker, arg},
      # Start to serve requests, typically the last entry
      PhoenixAv3Web.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: PhoenixAv3.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PhoenixAv3Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
