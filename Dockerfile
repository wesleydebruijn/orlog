FROM node:14.15-alpine as build

WORKDIR /usr/src/app
COPY src/web-client/package*.json ./
RUN yarn cache clean && yarn --update-checksums
COPY src/web-client/. ./
RUN yarn && yarn build

FROM elixir:1.11.2-alpine as releaser

WORKDIR /usr/src/app

# Install Hex + Rebar
RUN mix do local.hex --force, local.rebar --force

COPY src/server/config/ ./config/
COPY src/server/mix.exs ./
COPY src/server/mix.* ./

COPY src/server/apps/api/mix.exs ./apps/api/
COPY src/server/apps/game/mix.exs ./apps/game/
COPY --from=build /usr/src/app/build/ ./apps/api/priv/static/

ENV MIX_ENV=prod
RUN mix do deps.get --only $MIX_ENV, deps.compile

COPY . ./

WORKDIR /usr/src/app/apps/api
RUN MIX_ENV=prod mix compile

WORKDIR /usr/src/app/apps/game
RUN MIX_ENV=prod mix compile

WORKDIR /usr/src/app
RUN MIX_ENV=prod mix release

########################################################################

FROM elixir:1.11.2-alpine

EXPOSE 4000
ENV PORT=4000 \
  MIX_ENV=prod \
  SHELL=/bin/bash

WORKDIR /usr/src/app
COPY --from=releaser /usr/src/app/_build/prod/rel/api .

CMD ["bin/api start"]