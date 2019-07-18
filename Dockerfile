FROM nginx:alpine
LABEL maintainer="emilio@ociotec.com"

WORKDIR /usr/share/nginx/html

COPY index.html anthill.css anthill.js favicon.png ./
