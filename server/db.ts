import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, newsArticles, analysisResults, userAnalytics, InsertNewsArticle, InsertAnalysisResult, InsertUserAnalytic } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// News article queries
export async function createNewsArticle(article: InsertNewsArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsArticles).values(article);
  return result;
}

export async function getNewsArticlesByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(newsArticles).where(eq(newsArticles.userId, userId));
}

// Analysis result queries
export async function createAnalysisResult(result: InsertAnalysisResult) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(analysisResults).values(result);
}

export async function getAnalysisResultsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(analysisResults).where(eq(analysisResults.userId, userId));
}

export async function getAnalysisResultById(resultId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(analysisResults).where(eq(analysisResults.id, resultId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// User analytics queries
export async function getUserAnalytics(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(userAnalytics).where(eq(userAnalytics.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUserAnalytics(userId: number, updates: Partial<InsertUserAnalytic>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(userAnalytics).set(updates).where(eq(userAnalytics.userId, userId));
}

export async function deleteAnalysisResult(resultId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(analysisResults).where(eq(analysisResults.id, resultId));
}

export async function deleteNewsArticle(articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(newsArticles).where(eq(newsArticles.id, articleId));
}
