FROM node:latest as build

RUN apt-get update && apt-get install -y unzip

RUN apt-get install procps

RUN apt-get install iputils

ARG APP_FILE

WORKDIR /

COPY ${APP_FILE} app.zip

RUN unzip app.zip -d /app

WORKDIR /app

RUN npm ci

RUN npm run build

FROM nginx:latest

COPY --from=build /app/dist/playapp-fnt /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]