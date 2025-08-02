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
  organizationWebsite: text("organization_website"),
  documentUrl: text("document_url"),
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
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Document downloads tracking for professional environment
export const documentDownloads = pgTable("document_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfpId: varchar("rfp_id").notNull(),
  userEmail: text("user_email").notNull(),
  downloadedAt: timestamp("downloaded_at").notNull().default(sql`now()`),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

// RFP favorites/bookmarks for user tracking
export const rfpBookmarks = pgTable("rfp_bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rfpId: varchar("rfp_id").notNull(),
  userEmail: text("user_email").notNull(),
  bookmarkedAt: timestamp("bookmarked_at").notNull().default(sql`now()`),
});

// Search analytics for improving platform
export const searchAnalytics = pgTable("search_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  searchTerm: text("search_term"),
  filterTechnology: text("filter_technology"),
  filterOrganizationType: text("filter_organization_type"),
  resultsCount: integer("results_count"),
  searchedAt: timestamp("searched_at").notNull().default(sql`now()`),
  userSession: text("user_session"),
});

export type DocumentDownload = typeof documentDownloads.$inferSelect;
export type RfpBookmark = typeof rfpBookmarks.$inferSelect;
export type SearchAnalytic = typeof searchAnalytics.$inferSelect;
