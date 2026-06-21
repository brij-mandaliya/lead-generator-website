#!/bin/sh
set -e

NGINX_PORT="${PORT:-80}"
API_URL="${API_URL:-http://localhost:8080}"

export NGINX_PORT
export API_URL

envsubst '${NGINX_PORT} ${API_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
