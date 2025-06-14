defmodule PhoenixAv3Web.Router do
  use PhoenixAv3Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {PhoenixAv3Web.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_protected do
  plug :accepts, ["json"]
  plug PhoenixAv3Web.Auth
  end

  scope "/", PhoenixAv3Web do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  scope "/api", PhoenixAv3Web do
    pipe_through :api

    options "/*path", PhoenixAv3Web.OptionsController, :options
    post "/auth/login", AuthController, :login
    post "/auth/register", AuthController, :register
  end

  scope "/api", PhoenixAv3Web do
    pipe_through :api_protected

    resources "/users", UserController, except: [:new, :edit]
    resources "/tags", TagController, except: [:new, :edit]
    resources "/transactions", TransactionController, except: [:new, :edit]
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:phoenix_av3, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: PhoenixAv3Web.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
