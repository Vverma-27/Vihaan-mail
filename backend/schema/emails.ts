import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  userId: text("userId").notNull(),
  type: text("type").notNull(), // "draft" or "sent"
  status: text("status"), // "processed" or "failed" or "pending", can be null because status of drafts is null
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
