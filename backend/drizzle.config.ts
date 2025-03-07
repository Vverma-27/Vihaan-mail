import { defineConfig } from "drizzle-kit";
import config from "./config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "production"
        ? `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@postgres:5432/${config.POSTGRES_DB}`
        : `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@localhost:5432/${config.POSTGRES_DB}`,
    ssl: process.env.NODE_ENV === "production" ? "require" : undefined,
  },
});
