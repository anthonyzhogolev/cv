# syntax=docker/dockerfile:1

# ---------- build stage ----------
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# DATABASE_URL-заглушка: generate не подключается к БД,
# но prisma.config.ts требует переменную при загрузке конфига
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate
RUN npm run build

# ---------- runtime stage ----------
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production

# node_modules копируем из build-стадии целиком:
# помимо рантайм-зависимостей entrypoint'у нужны prisma CLI и tsx
# для миграций и seed при старте контейнера
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# сгенерированный Prisma Client нужен seed-скрипту (импортирует src/generated)
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/package.json ./
COPY docker/entrypoint.sh ./entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "./entrypoint.sh"]
