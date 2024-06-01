FROM node:latest as build

RUN apt-get update && apt-get install -y unzip

ARG APP_FILE

WORKDIR /

COPY ${APP_FILE} app.zip

RUN unzip app.zip -d /app

WORKDIR /app

RUN npm ci

RUN npm run build

FROM nginx:latest

RUN yum install -y iputils
RUN yum install -y procps

COPY --from=build /app/dist/playapp-fnt /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]