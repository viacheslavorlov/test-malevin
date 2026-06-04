import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { db } from "../db";
import { workEntries, workTypes, users } from "../db/schema";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { env } from "../env";

export const workEntryRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: env.jwtSecret,
    })
  )
  .derive(async ({ headers, jwt, set }) => {
    const auth = headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Неавторизован");
    }
    const payload = await jwt.verify(auth.slice(7));
    if (!payload) {
      set.status = 401;
      throw new Error("Неверный токен");
    }
    const userId = Number(payload.sub);

    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .get();
    if (!user) {
      set.status = 401;
      throw new Error("Пользователь не найден");
    }

    return { userId };
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
        return { error: "Запись не найдена" };
      }

      if (existing.userId !== userId) {
        set.status = 403;
        return { error: "Эта запись создана другим пользователем, вам не разрешено изменять её" };
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
        return { error: "Запись не найдена" };
      }

      if (existing.userId !== userId) {
        set.status = 403;
        return { error: "Эта запись создана другим пользователем, вам не разрешено удалять её" };
      }

      await db.delete(workEntries).where(eq(workEntries.id, params.id));
      return { success: true };
    },
    {
      params: t.Object({ id: t.Number() }),
    }
  );
