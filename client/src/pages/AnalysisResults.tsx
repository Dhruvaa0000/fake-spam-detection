import { useParams, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle2, BarChart3, Loader2, ArrowLeft, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AnalysisParams {
  analysisId: string;
}

export default function AnalysisResults() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { analysisId } = useParams<AnalysisParams>();
  const [shared, setShared] = useState(false);

  const { data: analysis, isLoading, error } = trpc.news.getAnalysisDetails.useQuery(
    { analysisId: parseInt(analysisId || "0") },
    { enabled: isAuthenticated && !!analysisId }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <Button onClick={() => navigate("/")} className="w-full">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading analysis...</p>
        </Card>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The analysis you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/detect")} className="w-full">
            Analyze Another Article
          </Button>
        </Card>
      </div>
    );
  }

  const isRealNews = analysis.verdict === "REAL";
  const verdictColor = isRealNews ? "text-real-news" : "text-fake-news";
  const verdictBgColor = isRealNews ? "bg-real-news" : "bg-fake-news";
  const verdictBorderColor = isRealNews ? "border-real-news" : "border-fake-news";

  const handleShare = () => {
    const text = `I just analyzed a news article using AI Fake News Detector. Verdict: ${analysis.verdict} (${analysis.confidence}% confidence)`;
    if (navigator.share) {
      navigator.share({
        title: "AI Fake News Detector",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
    setShared(true);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/detect")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Analyzer
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </Button>
        </div>

        {/* Main Verdict Card */}
        <Card className={`p-8 mb-8 border-2 ${verdictBorderColor}`}>
          <div className="text-center">
            {isRealNews ? (
              <CheckCircle2 className={`w-20 h-20 ${verdictColor} mx-auto mb-6`} />
            ) : (
              <AlertCircle className={`w-20 h-20 ${verdictColor} mx-auto mb-6`} />
            )}

            <h1 className={`text-5xl font-bold mb-4 ${verdictColor}`}>
              {analysis.verdict} NEWS
            </h1>

              <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-1">Confidence</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analysis.confidence}%
                </p>
              </div>
              <div className="w-px h-16 bg-border" />
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-1">Sentiment</p>
                <p className="text-2xl font-bold">
                  {(analysis.sentimentScore ?? 0) > 0 ? "😊" : (analysis.sentimentScore ?? 0) < 0 ? "😞" : "😐"}
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {analysis.explanation}
            </p>

            <div className="mt-8 flex gap-4 justify-center">
              <Button
                onClick={() => navigate("/detect")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Analyze Another
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/history")}
              >
                View History
              </Button>
            </div>
          </div>
        </Card>

        {/* Detailed Analysis Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Keywords */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Key Terms Extracted
            </h2>
            <div className="flex flex-wrap gap-2">
                {analysis.keywords && analysis.keywords.length > 0 ? (
                analysis.keywords.map((keyword: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground">No keywords extracted</p>
              )}
            </div>
          </Card>

          {/* Sentiment Analysis */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Sentiment Analysis</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Sentiment Score</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                  <span className="font-bold text-lg">
                    {analysis.sentimentScore ?? 0}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {(analysis.sentimentScore ?? 0) > 20
                    ? "Positive sentiment"
                    : (analysis.sentimentScore ?? 0) < -20
                    ? "Negative sentiment"
                    : "Neutral sentiment"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* NLP Processing Steps */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">NLP Processing Steps</h2>

          <div className="space-y-6">
            {/* Tokenization */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">1. Tokenization</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Breaking down the text into individual words and tokens
              </p>
              <div className="bg-input rounded-lg p-4 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {analysis.processingSteps?.tokenization?.slice(0, 20).map(
                    (token: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-mono"
                      >
                        {token}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Stopword Removal */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">2. Stopword Removal</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Filtering out common words that don't carry significant meaning
              </p>
              <div className="bg-input rounded-lg p-4 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {analysis.processingSteps?.stopwordRemoval?.slice(0, 20).map(
                    (token: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs font-mono"
                      >
                        {token}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* TF-IDF Scores */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">3. TF-IDF Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Calculating importance scores for key terms
              </p>
              <div className="space-y-2">
                {analysis.processingSteps?.tfIdfScores?.slice(0, 10).map(
                  (item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <span className="w-24 font-mono text-sm truncate">
                        {item.word}
                      </span>
                      <div className="flex-1 h-2 bg-input rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                          style={{
                            width: `${Math.min(100, (item.score || 0) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {(item.score || 0).toFixed(3)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Sentiment Analysis Step */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">4. Sentiment Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {analysis.processingSteps?.sentimentAnalysis}
              </p>
            </div>
          </div>
        </Card>

        {/* Confidence Breakdown */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Analysis Confidence</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Overall Confidence</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analysis.confidence}%
                </span>
              </div>
              <div className="h-3 bg-input rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              This confidence score is based on multiple NLP features including text patterns,
              sentiment analysis, keyword frequency, and linguistic characteristics.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
