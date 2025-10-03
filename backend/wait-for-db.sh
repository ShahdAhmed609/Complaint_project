#!/bin/sh
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

until pg_isready -h "$host" -p 5432 -U postgres > /dev/null 2>&1; do
  >&2 echo "⏳ Waiting for Postgres at $host:5432..."
  sleep 2
done

>&2 echo "✅ Postgres is up - executing command"
exec $cmd
