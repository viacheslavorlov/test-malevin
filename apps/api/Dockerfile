FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json

RUN bun install --frozen-lockfile --production

COPY apps/api/src apps/api/src

EXPOSE 3001

VOLUME /app/apps/api/data

CMD ["bun", "run", "apps/api/src/index.ts"]
