FROM nginx:1.14

RUN apt-get -y update && apt-get install -y curl
HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://localhost/health || exit 1

RUN mkdir -p /tmp/assets
RUN chown -R www-data:www-data /tmp/assets
VOLUME ['/tmp/assets']

COPY default.conf /etc/nginx/conf.d/default.conf
