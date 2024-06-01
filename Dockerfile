# Building the app
FROM node:latest as build

RUN apt-get update && apt-get install -y unzip

ARG APP_FILE

WORKDIR /

COPY ${APP_FILE} app.zip

RUN mkdir -p /app && unzip app.zip -d /app

WORKDIR /app

RUN npm ci

RUN npm run build

# Deploying the app
FROM nginx:latest

COPY --from=build /app/dist/playapp-fnt /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html

EXPOSE 80