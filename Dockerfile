FROM node:16.13-bullseye-slim AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install pm2 -g

FROM builder AS local
ENTRYPOINT [ "src/config/entrypoint.sh" ]

FROM builder AS remote
COPY . .
RUN npm run build
ENV TS_NODE_BASEURL=./dist
COPY ./src/config/.env.example ./dist/src/config/.env.example
COPY ./src/interfaces/express/public ./dist/src/interfaces/express/public
ENTRYPOINT [ "src/config/entrypoint.sh" ]
