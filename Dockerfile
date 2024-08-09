FROM node:20-alpine AS base

# BUILD SERVER
FROM base AS build-app

WORKDIR /app

COPY ["server/package.json", "server/yarn.lock"]

RUN yarn install

COPY server .

RUN yarn build

# SERVE APP
FROM base AS serve-app

WORKDIR /app

COPY --from=build-app /app/node_modules server/node_modules
COPY --from=build-app /app/package.json server/package.json
COPY --from=build-app /app/dist server/dist

WORKDIR /app/dist

CMD [ "node", "index.js" ]

EXPOSE 7889
