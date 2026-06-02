import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "change-me-in-production",
    })
  )
  .post(
    "/api/auth/register",
    async ({ body, jwt, set }) => {
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, body.username))
        .limit(1);

      if (existing.length > 0) {
        set.status = 409;
        return { error: "Username already taken" };
      }

      const passwordHash = await bcrypt.hash(body.password, 10);
      const user = await db
        .insert(users)
        .values({ username: body.username, passwordHash })
        .returning()
        .get();

      const token = await jwt.sign({ sub: String(user.id), username: user.username });
      return { token, user: { id: user.id, username: user.username } };
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3 }),
        password: t.String({ minLength: 4 }),
      }),
    }
  )
  .post(
    "/api/auth/login",
    async ({ body, jwt, set }) => {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, body.username))
        .limit(1)
        .get();

      if (!user) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }

      const valid = await bcrypt.compare(body.password, user.passwordHash);
      if (!valid) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }

      const token = await jwt.sign({ sub: String(user.id), username: user.username });
      return { token, user: { id: user.id, username: user.username } };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    }
  );
