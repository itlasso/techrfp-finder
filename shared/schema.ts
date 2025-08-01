import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rfps = pgTable("rfps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  description: text("description").notNull(),
  technology: text("technology").notNull(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  deadline: timestamp("deadline").notNull(),
  postedDate: timestamp("posted_date").notNull().default(sql`now()`),
  location: text("location").notNull(),
  organizationType: text("organization_type").notNull(),
  contactEmail: text("contact_email"),
  isDrupal: boolean("is_drupal").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertRfpSchema = createInsertSchema(rfps).omit({
  id: true,
  postedDate: true,
});

export type InsertRfp = z.infer<typeof insertRfpSchema>;
export type Rfp = typeof rfps.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
