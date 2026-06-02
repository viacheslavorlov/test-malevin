import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { workEntries, workTypes } from "../db/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";

export const workEntryRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "change-me-in-production",
    })
  )
  .derive(async ({ headers, jwt }) => {
    const auth = headers.authorization;
    if (!auth?.startsWith("Bearer ")) throw new Error("Unauthorized");
    const payload = await jwt.verify(auth.slice(7));
    if (!payload) throw new Error("Unauthorized");
    return { userId: Number(payload.sub) };
  })
  .get(
    "/api/work-entries",
    async ({ query }) => {
      const conditions = [];

      if (query.dateFrom) {
        conditions.push(sql`date >= ${query.dateFrom}`);
      }
      if (query.dateTo) {
        conditions.push(sql`date <= ${query.dateTo}`);
      }

      const orderBy = query.sort === "asc"
        ? [asc(workEntries.date), asc(workEntries.createdAt)]
        : [desc(workEntries.date), desc(workEntries.createdAt)];

      const entries = db
        .select({
          id: workEntries.id,
          date: workEntries.date,
          workTypeId: workEntries.workTypeId,
          workTypeName: workTypes.name,
          volume: workEntries.volume,
          unit: workEntries.unit,
          executorName: workEntries.executorName,
          userId: workEntries.userId,
          createdAt: workEntries.createdAt,
          updatedAt: workEntries.updatedAt,
        })
        .from(workEntries)
        .innerJoin(workTypes, eq(workEntries.workTypeId, workTypes.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(...orderBy)
        .all();

      return { entries };
    },
    {
      query: t.Object({
        dateFrom: t.Optional(t.String()),
        dateTo: t.Optional(t.String()),
        sort: t.Optional(t.String()),
      }),
    }
  )
  .post(
    "/api/work-entries",
    async ({ body, userId }) => {
      const entry = await db
        .insert(workEntries)
        .values({
          date: body.date,
          workTypeId: body.workTypeId,
          volume: body.volume,
          unit: body.unit,
          executorName: body.executorName,
          userId,
        })
        .returning()
        .get();

      return { entry };
    },
    {
      body: t.Object({
        date: t.String(),
        workTypeId: t.Number(),
        volume: t.Number(),
        unit: t.String(),
        executorName: t.String(),
      }),
    }
  )
  .put(
    "/api/work-entries/:id",
    async ({ params, body, userId, set }) => {
      const existing = await db
        .select()
        .from(workEntries)
        .where(eq(workEntries.id, params.id))
        .limit(1)
        .get();

      if (!existing) {
        set.status = 404;
        return { error: "Entry not found" };
      }

      if (existing.userId !== userId) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      const entry = await db
        .update(workEntries)
        .set({
          date: body.date,
          workTypeId: body.workTypeId,
          volume: body.volume,
          unit: body.unit,
          executorName: body.executorName,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(workEntries.id, params.id))
        .returning()
        .get();

      return { entry };
    },
    {
      params: t.Object({ id: t.Number() }),
      body: t.Object({
        date: t.String(),
        workTypeId: t.Number(),
        volume: t.Number(),
        unit: t.String(),
        executorName: t.String(),
      }),
    }
  )
  .delete(
    "/api/work-entries/:id",
    async ({ params, userId, set }) => {
      const existing = await db
        .select()
        .from(workEntries)
        .where(eq(workEntries.id, params.id))
        .limit(1)
        .get();

      if (!existing) {
        set.status = 404;
        return { error: "Entry not found" };
      }

      if (existing.userId !== userId) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      await db.delete(workEntries).where(eq(workEntries.id, params.id));
      return { success: true };
    },
    {
      params: t.Object({ id: t.Number() }),
    }
  );
