import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from ".";
import { users } from "../schema/users";
import { emails } from "../schema/emails";

// Database Connection
const sql = postgres(
  `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@postgres:5432/${config.POSTGRES_DB}`
);
export const db = drizzle(sql, { schema: { ...users, ...emails } });
