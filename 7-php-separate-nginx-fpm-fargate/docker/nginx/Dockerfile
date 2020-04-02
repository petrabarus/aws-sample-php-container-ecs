FROM nginx:1.14

RUN apt-get -y update && apt-get install -y curl
HEALTHCHECK --interval=1m --timeout=3s CMD curl --fail http://localhost/health || exit 1

COPY default.conf /etc/nginx/conf.d/default.conf