FROM node:latest as build

RUN apt-get update && apt-get install -y unzip

ARG APP_FILE

WORKDIR /

COPY ${APP_FILE} app.zip

RUN unzip app.zip -d /app

WORKDIR /app

RUN npm ci

RUN npm run build

CMD ["npm", "start"]
