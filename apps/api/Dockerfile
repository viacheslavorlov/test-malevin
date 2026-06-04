FROM oven/bun:1.3.9 AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN bun install --frozen-lockfile --filter=api

COPY apps/api/src apps/api/src
COPY apps/api/tsconfig.json apps/api/tsconfig.json

WORKDIR /app/apps/api

RUN bun run build

FROM oven/bun:1.3.9

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=/app/apps/api/data/data.db
ENV JWT_SECRET=change-me-in-production
ENV PORT=3001

COPY --from=builder /app/apps/api/dist apps/api/dist

RUN mkdir -p /app/apps/api/data

EXPOSE 3001

VOLUME ["/app/apps/api/data"]

CMD ["bun", "apps/api/dist/index.js"]
