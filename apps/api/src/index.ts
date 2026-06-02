import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { runMigrations } from "./db/migrate";
import { seedWorkTypes } from "./db/seed";
import { authRoutes } from "./routes/auth";
import { workEntryRoutes } from "./routes/work-entries";
import { workTypeRoutes } from "./routes/work-types";

runMigrations();
seedWorkTypes();

const app = new Elysia()
  .use(cors({ origin: true, credentials: true }))
  .use(authRoutes)
  .use(workEntryRoutes)
  .use(workTypeRoutes)
  .get("/api/health", () => ({ status: "ok" }))
  .listen(3001);

console.log(`API running at ${app.server?.hostname}:${app.server?.port}`);
