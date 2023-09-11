FROM node:16-alpine

WORKDIR /app

COPY ./common ./common
COPY ./config ./config
COPY ./plugins ./plugins
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./server.js ./
COPY ./.npmrc ./
COPY ./.yo-rc.json ./
COPY ./README.md ./

ENV NODE_ENV=production

RUN npm ci

EXPOSE 9000
CMD ["node", "./server.js"]