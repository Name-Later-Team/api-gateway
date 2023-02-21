FROM node:16.15.1-alpine

WORKDIR /app

COPY ./config ./config
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./server.js ./

RUN npm ci

LABEL author.name="Le Hoang Anh"
LABEL author.email="lehoanganh.le2001@gmail.com"

EXPOSE 3000
CMD ["node", "./server.js"]