import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: text("google_id").unique().notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  picture: text("picture"),
  createdAt: timestamp("created_at").defaultNow(),
});
