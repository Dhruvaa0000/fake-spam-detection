import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, Loader2, Trash2, Eye, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function History() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: history, isLoading, refetch } = trpc.news.getHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteMutation = trpc.news.deleteAnalysis.useMutation();

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

  const handleDelete = async (analysisId: number) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;

    setDeletingId(analysisId);
    try {
      await deleteMutation.mutateAsync({ analysisId });
      toast.success("Analysis deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete analysis");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading history...</p>
        </Card>
      </div>
    );
  }

  const analyses = history || [];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analysis History</h1>
          <p className="text-muted-foreground">
            View all your previous news analyses and verdicts
          </p>
        </div>

        {analyses.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Analyses Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't analyzed any news articles yet. Start by analyzing your first article!
            </p>
            <Button
              onClick={() => navigate("/detect")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Analyze News Now
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-muted-foreground text-sm mb-1">Total Analyses</p>
                <p className="text-3xl font-bold">{analyses.length}</p>
              </Card>
              <Card className="p-6 bg-real-news border-real-news">
                <p className="text-green-900 dark:text-green-100 text-sm mb-1">Real News</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {analyses.filter((a: any) => a.verdict === "REAL").length}
                </p>
              </Card>
              <Card className="p-6 bg-fake-news border-fake-news">
                <p className="text-red-900 dark:text-red-100 text-sm mb-1">Fake News</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {analyses.filter((a: any) => a.verdict === "FAKE").length}
                </p>
              </Card>
            </div>

            {/* Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Verdict</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Confidence</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Sentiment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {analyses.map((analysis: any) => (
                      <tr
                        key={analysis.id}
                        className="hover:bg-card/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {analysis.verdict === "REAL" ? (
                              <span className="px-3 py-1 bg-real-news text-real-news rounded-full text-sm font-semibold">
                                ✓ REAL
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-fake-news text-fake-news rounded-full text-sm font-semibold">
                                ✗ FAKE
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-input rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                                style={{ width: `${analysis.confidence}%` }}
                              />
                            </div>
                            <span className="font-semibold text-sm">
                              {analysis.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm">
                            {(analysis.sentimentScore ?? 0) > 20
                              ? "😊 Positive"
                              : (analysis.sentimentScore ?? 0) < -20
                              ? "😞 Negative"
                              : "😐 Neutral"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(analysis.createdAt).toLocaleDateString()} at{" "}
                            {new Date(analysis.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/analysis/${analysis.id}`)}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(analysis.id)}
                              disabled={deletingId === analysis.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              {deletingId === analysis.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate("/detect")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Analyze Another Article
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/analytics")}
              >
                View Analytics
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
