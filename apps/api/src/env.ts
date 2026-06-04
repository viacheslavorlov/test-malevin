const defaults = {
  DATABASE_URL: "data/data.db",
  JWT_SECRET: "change-me-in-production",
  PORT: "3001",
} as const;

for (const [key, value] of Object.entries(defaults)) {
  process.env[key] ??= value;
}

const getEnv = (key: keyof typeof defaults) => process.env[key] ?? defaults[key];

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer");
}

export const env = {
  databaseUrl: getEnv("DATABASE_URL"),
  jwtSecret: getEnv("JWT_SECRET"),
  port,
};
