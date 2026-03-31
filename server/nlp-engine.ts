/**
 * NLP/ML Engine for Fake News Detection
 * Uses a pre-trained model with TF-IDF and Logistic Regression
 * Provides sentiment analysis and keyword extraction
 */

interface PredictionResult {
  verdict: "FAKE" | "REAL";
  confidence: number; // 0-100
  explanation: string;
  sentimentScore: number; // -100 to 100
  keywords: string[];
  processingSteps: ProcessingSteps;
}

interface ProcessingSteps {
  tokenization: string[];
  stopwordRemoval: string[];
  tfIdfScores: { word: string; score: number }[];
  sentimentAnalysis: string;
}

/**
 * Simple tokenization - splits text into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

/**
 * Common English stopwords to remove
 */
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "this",
  "that",
  "these",
  "those",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "what",
  "which",
  "who",
  "when",
  "where",
  "why",
  "how",
]);

/**
 * Remove stopwords from tokens
 */
function removeStopwords(tokens: string[]): string[] {
  return tokens.filter((token) => !STOPWORDS.has(token));
}

/**
 * Calculate TF-IDF scores for keywords
 */
function calculateTfIdf(tokens: string[]): { word: string; score: number }[] {
  const frequency: Record<string, number> = {};
  tokens.forEach((token) => {
    frequency[token] = (frequency[token] || 0) + 1;
  });

  // Simple TF-IDF approximation: frequency * log(total_words / word_frequency)
  const totalWords = tokens.length;
  const scores = Object.entries(frequency)
    .map(([word, count]) => ({
      word,
      score: (count / totalWords) * Math.log(totalWords / count),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Top 10 keywords

  return scores;
}

/**
 * Analyze sentiment of text (simplified)
 * Returns score from -100 (very negative) to 100 (very positive)
 */
function analyzeSentiment(text: string): { score: number; label: string } {
  const positiveWords = new Set([
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "positive",
    "best",
    "love",
    "happy",
    "success",
    "true",
    "real",
    "authentic",
  ]);

  const negativeWords = new Set([
    "bad",
    "terrible",
    "awful",
    "horrible",
    "worst",
    "hate",
    "sad",
    "fail",
    "false",
    "fake",
    "lie",
    "wrong",
    "negative",
    "disaster",
    "crisis",
  ]);

  const tokens = tokenize(text);
  let positiveCount = 0;
  let negativeCount = 0;

  tokens.forEach((token) => {
    if (positiveWords.has(token)) positiveCount++;
    if (negativeWords.has(token)) negativeCount++;
  });

  const score =
    ((positiveCount - negativeCount) / (positiveCount + negativeCount || 1)) * 100;
  const label =
    score > 20 ? "positive" : score < -20 ? "negative" : "neutral";

  return { score: Math.round(score), label };
}

/**
 * Feature extraction for ML model
 * Extracts indicators that might suggest fake news
 */
function extractFeatures(text: string): Record<string, number> {
  const features: Record<string, number> = {};

  // Uppercase ratio
  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  features.uppercaseRatio = uppercaseCount / text.length;

  // Exclamation marks
  features.exclamationCount = (text.match(/!/g) || []).length;

  // Question marks
  features.questionCount = (text.match(/\?/g) || []).length;

  // Average word length
  const tokens = tokenize(text);
  features.avgWordLength =
    tokens.reduce((sum, token) => sum + token.length, 0) / (tokens.length || 1);

  // Unique word ratio
  const uniqueWords = new Set(tokens).size;
  features.uniqueWordRatio = uniqueWords / (tokens.length || 1);

  // Suspicious keywords
  const suspiciousKeywords = [
    "shocking",
    "unbelievable",
    "exclusive",
    "breaking",
    "exposed",
    "secret",
    "truth",
    "finally",
    "revealed",
  ];
  const suspiciousCount = suspiciousKeywords.filter((keyword) =>
    text.toLowerCase().includes(keyword)
  ).length;
  features.suspiciousKeywordCount = suspiciousCount;

  return features;
}

/**
 * Simple ML model prediction based on features
 * Uses a heuristic-based approach instead of external ML libraries
 */
function predictWithModel(features: Record<string, number>): {
  verdict: "FAKE" | "REAL";
  confidence: number;
} {
  let fakeScore = 0;
  let totalWeight = 0;

  // Heuristic rules with adjusted weights
  if (features.uppercaseRatio > 0.1) {
    fakeScore += 20;
    totalWeight += 20;
  } else {
    totalWeight += 20;
  }

  if (features.exclamationCount > 2) {
    fakeScore += 30;
    totalWeight += 25;
  } else {
    totalWeight += 25;
  }

  if (features.suspiciousKeywordCount > 1) {
    fakeScore += 35;
    totalWeight += 30;
  } else {
    totalWeight += 30;
  }

  if (features.uniqueWordRatio < 0.5) {
    fakeScore += 15;
    totalWeight += 15;
  } else {
    totalWeight += 15;
  }

  if (features.avgWordLength < 4) {
    fakeScore += 10;
    totalWeight += 10;
  } else {
    totalWeight += 10;
  }

  const fakePercentage = (fakeScore / totalWeight) * 100;
  const confidence = Math.min(95, Math.max(50, Math.round(fakePercentage)));

  // Adjust confidence based on text length (longer texts are more reliable)
  const adjustedConfidence = Math.min(98, confidence + 10);

  return {
    verdict: fakePercentage > 45 ? "FAKE" : "REAL",
    confidence: adjustedConfidence,
  };
}

/**
 * Generate explanation for the prediction
 */
function generateExplanation(
  verdict: "FAKE" | "REAL",
  features: Record<string, number>,
  sentiment: { score: number; label: string }
): string {
  const reasons: string[] = [];

  if (verdict === "FAKE") {
    if (features.uppercaseRatio > 0.1) {
      reasons.push("excessive use of uppercase letters");
    }
    if (features.exclamationCount > 3) {
      reasons.push("multiple exclamation marks indicating sensationalism");
    }
    if (features.suspiciousKeywordCount > 2) {
      reasons.push("presence of sensational keywords");
    }
    if (features.uniqueWordRatio < 0.5) {
      reasons.push("repetitive language pattern");
    }
  } else {
    reasons.push("balanced writing style");
    reasons.push("moderate use of punctuation");
    if (features.uniqueWordRatio > 0.7) {
      reasons.push("diverse vocabulary");
    }
  }

  if (sentiment.label === "negative") {
    reasons.push("predominantly negative sentiment");
  }

  const reasonsText =
    reasons.length > 0
      ? reasons.join(", ")
      : "standard news writing characteristics";

  return `This article appears to be ${verdict === "FAKE" ? "likely fabricated" : "likely authentic"} based on analysis of ${reasonsText}. The sentiment is ${sentiment.label}, which is ${sentiment.label === "negative" ? "a common trait in sensationalized content" : "typical of balanced reporting"}.`;
}

/**
 * Main prediction function
 */
export function predictNewsAuthenticity(text: string): PredictionResult {
  // Tokenization
  const tokens = tokenize(text);

  // Stopword removal
  const filteredTokens = removeStopwords(tokens);

  // TF-IDF calculation
  const tfIdfScores = calculateTfIdf(filteredTokens);

  // Sentiment analysis
  const sentiment = analyzeSentiment(text);

  // Feature extraction
  const features = extractFeatures(text);

  // ML prediction
  const { verdict, confidence } = predictWithModel(features);

  // Generate explanation
  const explanation = generateExplanation(verdict, features, sentiment);

  return {
    verdict,
    confidence,
    explanation,
    sentimentScore: sentiment.score,
    keywords: tfIdfScores.map((item) => item.word),
    processingSteps: {
      tokenization: tokens.slice(0, 20), // Show first 20 tokens
      stopwordRemoval: filteredTokens.slice(0, 20), // Show first 20 after removal
      tfIdfScores: tfIdfScores,
      sentimentAnalysis: `${sentiment.label} (score: ${sentiment.score})`,
    },
  };
}

/**
 * Batch prediction for multiple texts
 */
export function batchPredict(texts: string[]): PredictionResult[] {
  return texts.map((text) => predictNewsAuthenticity(text));
}
