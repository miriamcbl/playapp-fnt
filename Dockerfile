FROM node:latest as build

RUN yum install -y unzip

ARG APP_FILE

WORKDIR /

COPY ${APP_FILE} app.zip

RUN unzip app.zip /app

WORKDIR /app

RUN npm install

COPY ${ALL_CODE} .

RUN npm run build

EXPOSE 4200

CMD ["npm", "start"]