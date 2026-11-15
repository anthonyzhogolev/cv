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

Откройте **http://localhost:3000/graphql** — это Apollo Sandbox. Пример запроса:

```graphql
query {
  profile {
    fullName
    title
    location
    skills {
      level
      skill { name category }
    }
    experience { company position startDate endDate }
    projects { name description techStack repoUrl }
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

## Тесты

```bash
npm test
```

Юнит-тесты (Vitest) проверяют сервисы с замоканным `PrismaService` — бизнес-логика тестируется без базы данных и GraphQL.

## Архитектура

Трёхслойное разделение ответственности (направление зависимостей — сверху вниз):

```
GraphQL-запрос
      │
      ▼
Resolver (*.resolver.ts)   — слой API: декораторы @Query, приём аргументов
      │
      ▼
Service (*.service.ts)     — бизнес-логика, не знает о GraphQL
      │
      ▼
PrismaService              — единственная точка доступа к БД (PrismaClient + pg-адаптер)
```

Каждая сущность — отдельный модуль NestJS (`profile`, `experience`, `skill`, `project`). `PrismaModule` глобальный.

### Модель данных (`prisma/schema.prisma`)

- `Profile` — профиль специалиста (контакты, ссылки);
- `Experience` — опыт работы (`endDate = null` → «по настоящее время»);
- `Skill` — справочник навыков с категорией (enum `SkillCategory`);
- `ProfileSkill` — связь M:N «профиль ↔ навык» с уровнем владения (enum `SkillLevel`);
- `Project` — проекты со стеком технологий.

### Структура проекта

```
├── docker-compose.yml       # postgres + app (запуск одной командой)
├── docker-compose.dev.yml   # только postgres для локальной разработки
├── Dockerfile               # multi-stage сборка
├── docker/entrypoint.sh     # migrate deploy → seed → start
├── prisma/
│   ├── schema.prisma        # модели данных
│   ├── migrations/          # SQL-миграции
│   └── seed.ts              # данные визитки (замените на свои!)
├── src/
│   ├── main.ts              # bootstrap
│   ├── app.module.ts        # GraphQLModule (code-first, Apollo Sandbox)
│   ├── schema.gql           # генерируется автоматически при старте
│   ├── prisma/              # PrismaModule + PrismaService
│   ├── profile/             # модуль: model / service / resolver (+ тесты)
│   ├── experience/
│   ├── skill/
│   └── project/
└── prisma.config.ts         # конфиг Prisma (schema, миграции, seed, DATABASE_URL)
```

## Свои данные

Все данные визитки лежат в одном файле — `prisma/seed.ts`. Отредактируйте его и пересоздайте базу:

```bash
docker compose down -v && docker compose up --build
```

## Деплой

Образ готов к деплою на платформы, запускающие Dockerfile (Railway, Render): приложение слушает порт из `PORT`, `DATABASE_URL` задаётся переменной окружения, миграции и seed выполняются при старте контейнера.
