FROM php:8.2.12-cli

RUN docker-php-ext-install pdo_mysql

WORKDIR /usr/src/app

COPY . .

EXPOSE 80

CMD [ "php", "-S", "0.0.0.0:80", "-t", "public" ]