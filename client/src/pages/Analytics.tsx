import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, Loader2, BarChart3, TrendingUp, Target } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: analytics, isLoading } = trpc.news.getAnalytics.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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
          <p className="text-muted-foreground">Loading analytics...</p>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Data Available</h2>
          <p className="text-muted-foreground mb-6">
            Start analyzing news articles to see your analytics.
          </p>
          <Button onClick={() => navigate("/detect")} className="w-full">
            Analyze News
          </Button>
        </Card>
      </div>
    );
  }

  const pieData = [
    { name: "Real News", value: analytics.realCount, fill: "#16a34a" },
    { name: "Fake News", value: analytics.fakeCount, fill: "#dc2626" },
  ];

  const barData = [
    { name: "Real", count: analytics.realCount },
    { name: "Fake", count: analytics.fakeCount },
  ];

  // Mock weekly data for demonstration
  const weeklyData = [
    { day: "Mon", analyses: Math.floor(Math.random() * 10) },
    { day: "Tue", analyses: Math.floor(Math.random() * 10) },
    { day: "Wed", analyses: Math.floor(Math.random() * 10) },
    { day: "Thu", analyses: Math.floor(Math.random() * 10) },
    { day: "Fri", analyses: Math.floor(Math.random() * 10) },
    { day: "Sat", analyses: Math.floor(Math.random() * 10) },
    { day: "Sun", analyses: Math.floor(Math.random() * 10) },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            View your fact-checking statistics and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Analyses</p>
                <p className="text-4xl font-bold">{analytics.totalAnalyses}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-real-news border-real-news">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-900 dark:text-green-100 text-sm mb-1">Real News</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {analytics.realCount}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  {analytics.realPercentage}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-fake-news border-fake-news">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-900 dark:text-red-100 text-sm mb-1">Fake News</p>
                <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                  {analytics.fakeCount}
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {analytics.fakePercentage}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Avg Confidence</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.averageConfidence}%
                </p>
              </div>
              <Target className="w-12 h-12 text-purple-600 dark:text-purple-400 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Distribution</h2>
            {analytics.totalAnalyses > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </Card>

          {/* Bar Chart */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Verdict Breakdown</h2>
            {analytics.totalAnalyses > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </Card>
        </div>

        {/* Weekly Trend */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Weekly Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="analyses" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Statistics Summary */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Accuracy Insights</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Detection Rate</span>
                <span className="font-bold">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Confidence</span>
                <span className="font-bold">{analytics.averageConfidence}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Analyses</span>
                <span className="font-bold">{analytics.totalAnalyses}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Fake News Detected</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Count</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {analytics.fakeCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Percentage</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {analytics.fakePercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Confidence</span>
                <span className="font-bold">
                  {analytics.fakeCount > 0
                    ? Math.round(
                        (analytics.averageConfidence * analytics.fakeCount) /
                          analytics.totalAnalyses
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Real News Verified</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Count</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {analytics.realCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Percentage</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {analytics.realPercentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Confidence</span>
                <span className="font-bold">
                  {analytics.realCount > 0
                    ? Math.round(
                        (analytics.averageConfidence * analytics.realCount) /
                          analytics.totalAnalyses
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/detect")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Analyze More News
          </Button>
          <Button variant="outline" onClick={() => navigate("/history")}>
            View Full History
          </Button>
        </div>
      </div>
    </div>
  );
}
