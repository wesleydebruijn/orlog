# ---- Client - Build Stage ----
FROM node:14.15-alpine as build

WORKDIR /usr/src/app
COPY src/web-client/package*.json ./
RUN yarn cache clean && yarn --update-checksums
COPY src/web-client/. ./
RUN yarn && yarn build

# ---- Server - Build Stage ----
FROM elixir:1.11.2-alpine as builder
ENV MIX_ENV=prod
COPY src/server/lib ./lib
COPY src/server/mix.exs .
COPY src/server/mix.lock .
COPY --from=build /usr/src/app/build/ ./priv/static/
RUN mix local.rebar --force \
  && mix local.hex --force \
  && mix deps.get \
  && mix release

# ---- Application Stage ----
FROM alpine:3
RUN apk add --no-cache --update bash openssl
EXPOSE 4000
ENV PORT=4000 \
  MIX_ENV=prod
WORKDIR /app
COPY --from=builder _build/prod/rel/orlog/ .
CMD ["/app/bin/orlog", "start"]
