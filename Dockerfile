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

# Modifying the nginx default config to point to our index.html
RUN echo 'server {' > /etc/nginx/conf.d/default.conf \
    && echo '    listen 80;' >> /etc/nginx/conf.d/default.conf \
    && echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf \
    && echo '    root /usr/share/nginx/html/browser;' >> /etc/nginx/conf.d/default.conf \
    && echo '    index index.html;' >> /etc/nginx/conf.d/default.conf \
    && echo '    location / {' >> /etc/nginx/conf.d/default.conf \
    && echo '        try_files $uri $uri/ =404;' >> /etc/nginx/conf.d/default.conf \
    && echo '    }' >> /etc/nginx/conf.d/default.conf \
    && echo '}' >> /etc/nginx/conf.d/default.conf

EXPOSE 80