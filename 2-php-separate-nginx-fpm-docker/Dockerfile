FROM php:7.3-fpm

RUN apt-get update -y && apt-get install -y wget libfcgi0ldbl
RUN wget -O /usr/local/bin/php-fpm-healthcheck \
    https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/master/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck
COPY ./docker/fpm/healthcheck.conf /usr/local/etc/php-fpm.d/
RUN mkdir -p /app
ADD ./src/ /app/

WORKDIR /app

HEALTHCHECK --interval=1m --timeout=3s CMD php-fpm-healthcheck || exit 1
