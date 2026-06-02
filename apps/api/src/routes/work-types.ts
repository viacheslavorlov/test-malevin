import { Elysia } from "elysia";
import { db } from "../db";
import { workTypes } from "../db/schema";

export const workTypeRoutes = new Elysia().get("/api/work-types", async () => {
  const types = await db.select().from(workTypes).all();
  return { workTypes: types };
});
