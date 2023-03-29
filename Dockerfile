# BUILD CLIENT
FROM node:16.14.2 as build-client

WORKDIR /app

COPY ["client/package.json", "client/yarn.lock", "./"]

RUN yarn install

COPY client .

RUN yarn build

# BUILD SERVER
FROM node:16.14.2 as build-app

WORKDIR /app/server

COPY ["server/package.json", "server/yarn.lock", "./"]

ARG github_token
ENV GITHUB_TOKEN=$github_token

RUN echo @privopsorg:registry=https://npm.pkg.github.com/ >> ~/.npmrc
RUN echo //npm.pkg.github.com/:_authToken=$GITHUB_TOKEN >> ~/.npmrc

RUN yarn install

COPY server .

RUN yarn build

# SERVE APP
FROM node:16.14.2-alpine as serve-app

WORKDIR /app

COPY --from=build-app /app/server/node_modules server/node_modules
COPY --from=build-app /app/server/package.json server/package.json
COPY --from=build-app /app/server/dist server/dist
COPY --from=build-client /app/build client/build

WORKDIR server/dist

CMD [ "node", "index.js" ]

EXPOSE 5502
