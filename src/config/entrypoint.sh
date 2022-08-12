#!/bin/bash
set -e

if [ -n "$1" ]; then
    exec "$@"
fi

if [[ $NODE_ENV = "development" ]] ; then
  /bin/bash src/config/wait-for-it.sh db:5432 --timeout=60 -- echo "db is up and running!"
  npm install --also=dev
  npm run typeorm migration:run
  npm run dev:watch
else
  npm run typeorm migration:run
  npm run start
fi
