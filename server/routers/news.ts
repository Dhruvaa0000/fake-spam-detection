import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createNewsArticle,
  createAnalysisResult,
  getAnalysisResultsByUserId,
  getUserAnalytics,
  updateUserAnalytics,
  deleteAnalysisResult,
  getAnalysisResultById,
} from "../db";
import { predictNewsAuthenticity } from "../nlp-engine";
import { TRPCError } from "@trpc/server";

export const newsRouter = router({
  // Analyze news article
  analyzeNews: protectedProcedure
    .input(
      z.object({
        content: z.string().min(10, "Content must be at least 10 characters"),
        title: z.string().optional(),
        source: z.string().optional(),
        fileType: z.enum(["text", "pdf", "direct"]).default("direct"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create news article record
        const articleResult = await createNewsArticle({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          source: input.source,
          fileType: input.fileType,
        });

        const articleId = (articleResult as any).insertId || 1;

        // Run NLP analysis
        const prediction = predictNewsAuthenticity(input.content);

        // Create analysis result record
        const analysisResult = await createAnalysisResult({
          articleId,
          userId: ctx.user.id,
          verdict: prediction.verdict,
          confidence: prediction.confidence,
          explanation: prediction.explanation,
          sentimentScore: prediction.sentimentScore,
          keywords: JSON.stringify(prediction.keywords),
          processingSteps: JSON.stringify(prediction.processingSteps),
        });

        // Update user analytics
        const userAnalytics = await getUserAnalytics(ctx.user.id);

        if (userAnalytics) {
          const newTotal = userAnalytics.totalAnalyses + 1;
          const newFakeCount =
            userAnalytics.fakeCount + (prediction.verdict === "FAKE" ? 1 : 0);
          const newRealCount =
            userAnalytics.realCount + (prediction.verdict === "REAL" ? 1 : 0);
          const newAvgConfidence = Math.round(
            (userAnalytics.averageConfidence * userAnalytics.totalAnalyses +
              prediction.confidence) /
              newTotal
          );

          await updateUserAnalytics(ctx.user.id, {
            totalAnalyses: newTotal,
            fakeCount: newFakeCount,
            realCount: newRealCount,
            averageConfidence: newAvgConfidence,
          });
        } else {
          // Create initial analytics record
          await updateUserAnalytics(ctx.user.id, {
            totalAnalyses: 1,
            fakeCount: prediction.verdict === "FAKE" ? 1 : 0,
            realCount: prediction.verdict === "REAL" ? 1 : 0,
            averageConfidence: prediction.confidence,
          });
        }

        return {
          success: true,
          analysisId: (analysisResult as any).insertId || 1,
          ...prediction,
        };
      } catch (error) {
        console.error("Analysis error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to analyze news article",
        });
      }
    }),

  // Get analysis history
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const results = await getAnalysisResultsByUserId(ctx.user.id);

      return results.map((result) => ({
        id: result.id,
        verdict: result.verdict,
        confidence: result.confidence,
        explanation: result.explanation,
        sentimentScore: result.sentimentScore,
        keywords: JSON.parse(result.keywords || "[]"),
        processingSteps: JSON.parse(result.processingSteps || "{}"),
        createdAt: result.createdAt,
      }));
    } catch (error) {
      console.error("History fetch error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch analysis history",
      });
    }
  }),

  // Get analysis details
  getAnalysisDetails: protectedProcedure
    .input(z.object({ analysisId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const result = await getAnalysisResultById(input.analysisId);

        if (!result || result.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Analysis not found",
          });
        }

        return {
          id: result.id,
          verdict: result.verdict,
          confidence: result.confidence,
          explanation: result.explanation,
          sentimentScore: result.sentimentScore,
          keywords: JSON.parse(result.keywords || "[]"),
          processingSteps: JSON.parse(result.processingSteps || "{}"),
          createdAt: result.createdAt,
        };
      } catch (error) {
        console.error("Details fetch error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch analysis details",
        });
      }
    }),

  // Delete analysis from history
  deleteAnalysis: protectedProcedure
    .input(z.object({ analysisId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await getAnalysisResultById(input.analysisId);

        if (!result || result.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Analysis not found",
          });
        }

        await deleteAnalysisResult(input.analysisId);

        // Update user analytics
        const userAnalytics = await getUserAnalytics(ctx.user.id);
        if (userAnalytics && userAnalytics.totalAnalyses > 0) {
          const newTotal = userAnalytics.totalAnalyses - 1;
          const newFakeCount =
            userAnalytics.fakeCount - (result.verdict === "FAKE" ? 1 : 0);
          const newRealCount =
            userAnalytics.realCount - (result.verdict === "REAL" ? 1 : 0);

          await updateUserAnalytics(ctx.user.id, {
            totalAnalyses: newTotal,
            fakeCount: Math.max(0, newFakeCount),
            realCount: Math.max(0, newRealCount),
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Delete error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete analysis",
        });
      }
    }),

  // Get user analytics
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    try {
      const analytics = await getUserAnalytics(ctx.user.id);

      if (!analytics) {
        return {
          totalAnalyses: 0,
          fakeCount: 0,
          realCount: 0,
          averageConfidence: 0,
          fakePercentage: 0,
          realPercentage: 0,
        };
      }

      const total = analytics.totalAnalyses || 1;
      const fakePercentage = Math.round(
        (analytics.fakeCount / total) * 100
      );
      const realPercentage = Math.round(
        (analytics.realCount / total) * 100
      );

      return {
        totalAnalyses: analytics.totalAnalyses,
        fakeCount: analytics.fakeCount,
        realCount: analytics.realCount,
        averageConfidence: analytics.averageConfidence,
        fakePercentage,
        realPercentage,
      };
    } catch (error) {
      console.error("Analytics fetch error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch analytics",
      });
    }
  }),
});
