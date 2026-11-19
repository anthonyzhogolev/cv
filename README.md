# Цифровая визитка (CV)

Backend-приложение «цифровая визитка»: GraphQL API с информацией о специалисте — профиль, опыт работы, навыки и проекты. При запуске база данных автоматически мигрируется и наполняется данными, а по адресу `/graphql` доступен **Apollo Sandbox** для интерактивных запросов.

## Стек

- **TypeScript / Node.js** — язык и платформа
- **NestJS 12** — фреймворк (модульная архитектура, DI)
- **GraphQL (code-first) + Apollo Server** — API; схема генерируется из декораторов в `src/schema.gql`
- **Prisma 7 + PostgreSQL 16** — ORM и база данных
- **Docker / Docker Compose** — запуск одной командой

## Быстрый старт (Docker)

Требуется только Docker:

```bash
docker compose up --build
```

Что произойдёт автоматически:

1. Поднимется контейнер PostgreSQL (данные хранятся в volume `pgdata`).
2. Соберётся образ приложения (multi-stage Dockerfile).
3. При старте контейнера приложения entrypoint выполнит `prisma migrate deploy` (создание таблиц) и `prisma db seed` (наполнение данными визитки).
4. Приложение начнёт слушать порт 3000.

Seed выполняется только при `SEED_DB=true` — в `docker-compose.yml` переменная задана, поэтому локальный запуск наполняет базу. На проде (Render) переменной нет, и seed пропускается: данные не перезатираются при каждом рестарте. Для разового наполнения продовой БД можно временно задать `SEED_DB=true` в окружении сервиса и перезапустить его.

Откройте **http://localhost:3000/graphql** — это Apollo Sandbox. Пример запроса:

```graphql
query {
  profile {
    fullName
    title
    location
    skills {
      level
      skill {
        name
        category
      }
    }
    experience {
      company
      position
      startDate
      endDate
    }
    projects {
      name
      description
      techStack
      repoUrl
    }
  }
}
```

Другие доступные запросы: `experiences`, `skills`, `projects`, `project(id: Int!)`. Полную схему смотрите в `src/schema.gql` или во вкладке Schema в Sandbox.

Остановка: `docker compose down` (данные в volume сохранятся; удалить вместе с данными — `docker compose down -v`).

## Локальная разработка

Для разработки с hot-reload в Docker поднимается только база:

```bash
cp .env.example .env                       # DATABASE_URL для локального запуска
docker compose -f docker-compose.dev.yml up -d   # PostgreSQL на порту 5433
npm ci
npx prisma migrate deploy                  # подготовить БД
npx prisma db seed                         # наполнить данными
npm run start:dev                          # http://localhost:3000/graphql
```

