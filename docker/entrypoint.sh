#!/bin/sh
set -e

echo "==> Applying database migrations..."
npx prisma migrate deploy

if [ "$SEED_DB" = "true" ]; then
  echo "==> Seeding database..."
  npx prisma db seed
else
  echo "==> Skipping seed (SEED_DB is not 'true')"
fi

echo "==> Starting application..."
exec node dist/main.js
