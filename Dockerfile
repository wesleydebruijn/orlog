# ---- Server - Build Stage ----
# Phoenix serves the 3D client, so assets are bundled with esbuild here too.
FROM elixir:1.20.4-otp-28-alpine as server-build
ENV MIX_ENV=prod
WORKDIR /build
COPY mix.exs mix.lock ./
RUN mix local.rebar --force \
  && mix local.hex --force \
  && mix deps.get --only prod
COPY config ./config
COPY lib ./lib
COPY assets ./assets
COPY priv ./priv
RUN mix assets.deploy \
  && mix release

# ---- Application Stage ----
FROM alpine:3.24
RUN apk add --no-cache --update bash openssl libstdc++ ncurses-libs
EXPOSE 4000
ENV PORT=4000 \
  MIX_ENV=prod
WORKDIR /app
COPY --from=server-build /build/_build/prod/rel/orlog/ .
CMD ["/app/bin/orlog", "start"]
