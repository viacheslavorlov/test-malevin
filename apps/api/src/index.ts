import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { runMigrations } from "./db/migrate";
import { seedWorkTypes } from "./db/seed";
import { authRoutes } from "./routes/auth";
import { workEntryRoutes } from "./routes/work-entries";
import { workTypeRoutes } from "./routes/work-types";
import { env } from "./env";

runMigrations();
await seedWorkTypes();

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
    } else if (set.status === 200) {
      set.status = 500;
    }
    const message = typeof error === "object" && error && "message" in error
      ? (error as Error).message
      : String(error);
    return { error: message };
  })
  .use(cors({ origin: true, credentials: true }))
  .use(authRoutes)
  .use(workEntryRoutes)
  .use(workTypeRoutes)
  .get("/api/health", () => ({ status: "ok" }))
  .listen({ hostname: "0.0.0.0", port: env.port });

console.log(`API running at ${app.server?.hostname}:${app.server?.port}`);
