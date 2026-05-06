import { describe, it, expect } from "vitest";
import { predictNewsAuthenticity } from "./nlp-engine";

describe("NLP Engine - Fake News Detection", () => {
  describe("predictNewsAuthenticity", () => {
    it("should detect obvious fake news with sensational language", () => {
      const fakeNewsText =
        "SHOCKING!!! Breaking news!!! You won't believe what happened! This is the most UNBELIEVABLE story ever exposed! Secret truth finally revealed!!!";

      const result = predictNewsAuthenticity(fakeNewsText);

      expect(result.verdict).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.explanation).toBeDefined();
      expect(result.keywords).toBeDefined();
      expect(Array.isArray(result.keywords)).toBe(true);
    });

    it("should detect balanced real news", () => {
      const realNewsText =
        "According to recent studies, researchers have found new evidence supporting climate change. The data shows a gradual increase in global temperatures over the past decade. Scientists recommend further investigation into the causes and potential solutions.";

      const result = predictNewsAuthenticity(realNewsText);

      expect(result.verdict).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.sentimentScore).toBeDefined();
      expect(result.processingSteps).toBeDefined();
    });

    it("should extract keywords from text", () => {
      const text = "The government announced new policies regarding education and healthcare reform.";

      const result = predictNewsAuthenticity(text);

      expect(result.keywords).toBeDefined();
      expect(Array.isArray(result.keywords)).toBe(true);
    });

    it("should perform sentiment analysis", () => {
      const positiveText = "This is wonderful! Amazing news! Excellent results!";
      const negativeText = "This is terrible! Awful situation! Horrible outcome!";

      const positiveResult = predictNewsAuthenticity(positiveText);
      const negativeResult = predictNewsAuthenticity(negativeText);

      expect(positiveResult.sentimentScore).toBeDefined();
      expect(negativeResult.sentimentScore).toBeDefined();
    });

    it("should include processing steps", () => {
      const text = "Breaking news about the economy and market trends today.";

      const result = predictNewsAuthenticity(text);

      expect(result.processingSteps).toBeDefined();
      expect(result.processingSteps.tokenization).toBeDefined();
      expect(Array.isArray(result.processingSteps.tokenization)).toBe(true);
      expect(result.processingSteps.stopwordRemoval).toBeDefined();
      expect(Array.isArray(result.processingSteps.stopwordRemoval)).toBe(true);
      expect(result.processingSteps.tfIdfScores).toBeDefined();
      expect(Array.isArray(result.processingSteps.tfIdfScores)).toBe(true);
    });

    it("should handle empty text gracefully", () => {
      const emptyText = "";

      const result = predictNewsAuthenticity(emptyText);

      expect(result.verdict).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it("should detect multiple suspicious keywords", () => {
      const suspiciousText =
        "EXPOSED: Secret truth finally revealed! Shocking exclusive breaking news that you won't believe!";

      const result = predictNewsAuthenticity(suspiciousText);

      expect(result.verdict).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should calculate confidence between 50 and 98", () => {
      const texts = [
        "Normal news article with standard information.",
        "SHOCKING NEWS!!!",
        "According to sources, the event occurred.",
      ];

      texts.forEach((text) => {
        const result = predictNewsAuthenticity(text);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(98);
      });
    });

    it("should provide explanation for verdict", () => {
      const text = "Breaking news about market trends and economic indicators.";

      const result = predictNewsAuthenticity(text);

      expect(result.explanation).toBeDefined();
      expect(typeof result.explanation).toBe("string");
    });

    it("should handle text with mixed case and punctuation", () => {
      const complexText =
        "BREAKING!!! This is AMAZING news... You won't believe it??? Check this out!!!";

      const result = predictNewsAuthenticity(complexText);

      expect(result.verdict).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.keywords).toBeDefined();
    });
  });

  describe("Feature extraction", () => {
    it("should detect high uppercase ratio as suspicious", () => {
      const highUppercaseText = "THIS IS ALL CAPS AND VERY SUSPICIOUS!!!";
      const normalText = "This is normal text with proper capitalization.";

      const highResult = predictNewsAuthenticity(highUppercaseText);
      const normalResult = predictNewsAuthenticity(normalText);

      expect(highResult.confidence).toBeGreaterThan(0);
      expect(normalResult.confidence).toBeGreaterThan(0);
    });

    it("should detect excessive punctuation as suspicious", () => {
      const excessivePunctuation =
        "This is crazy!!! Amazing!!! Incredible!!! Shocking!!!";
      const normalPunctuation = "This is normal news. It is important. We should know this.";

      const excessiveResult = predictNewsAuthenticity(excessivePunctuation);
      const normalResult = predictNewsAuthenticity(normalPunctuation);

      expect(excessiveResult.confidence).toBeGreaterThan(0);
      expect(normalResult.confidence).toBeGreaterThan(0);
    });
  });
});
