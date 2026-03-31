import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// News analysis tables
export const newsArticles = mysqlTable("newsArticles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  source: varchar("source", { length: 255 }),
  fileType: varchar("fileType", { length: 10 }), // 'text', 'pdf', or 'direct'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const analysisResults = mysqlTable("analysisResults", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  userId: int("userId").notNull(),
  verdict: varchar("verdict", { length: 10 }).notNull(), // 'FAKE' or 'REAL'
  confidence: int("confidence").notNull(), // 0-100
  explanation: text("explanation"),
  sentimentScore: int("sentimentScore"), // -100 to 100
  keywords: text("keywords"), // JSON array
  processingSteps: text("processingSteps"), // JSON object with NLP steps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const userAnalytics = mysqlTable("userAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalAnalyses: int("totalAnalyses").default(0).notNull(),
  fakeCount: int("fakeCount").default(0).notNull(),
  realCount: int("realCount").default(0).notNull(),
  averageConfidence: int("averageConfidence").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = typeof analysisResults.$inferInsert;

export type UserAnalytic = typeof userAnalytics.$inferSelect;
export type InsertUserAnalytic = typeof userAnalytics.$inferInsert;