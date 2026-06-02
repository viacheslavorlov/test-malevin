# Журнал работ (Construction Work Log)

Внутренний инструмент для учёта выполненных работ на строительном объекте.

## Стек

- **Фронтенд**: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui
- **Бэкенд**: Elysia (Bun-native HTTP framework)
- **База данных**: SQLite (через Drizzle ORM)
- **Аутентификация**: JWT (bcryptjs + @elysiajs/jwt)
- **Менеджер пакетов**: Bun 1.3.9
- **Монорепозиторий**: Turborepo 2.9.14

## Быстрый запуск (Docker)

```bash
docker compose up --build
```

Фронтенд: http://localhost:3000  
API: http://localhost:3001

## Запуск для разработки

```bash
bun install
bun run dev
```

Фронтенд: http://localhost:3000  
API: http://localhost:3001

### Запуск отдельных пакетов

```bash
bun run dev --filter=web     # только фронтенд
bun run dev --filter=api     # только API
```

## Команды

| Команда | Описание |
|---------|----------|
| `bun run build` | Сборка всех пакетов |
| `bun run dev` | Режим разработки |
| `bun run lint` | ESLint (--max-warnings 0) |
| `bun run check-types` | TypeScript проверка типов |
| `bun run format` | Prettier форматирование |

## API Endpoints

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/work-entries?dateFrom=&dateTo=&sort=` — список записей
- `POST /api/work-entries` — создание записи
- `PUT /api/work-entries/:id` — редактирование записи
- `DELETE /api/work-entries/:id` — удаление записи
- `GET /api/work-types` — список видов работ
