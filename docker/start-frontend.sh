#!/bin/sh
set -e

NGINX_PORT="${PORT:-80}"

export NGINX_PORT

envsubst '${NGINX_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
