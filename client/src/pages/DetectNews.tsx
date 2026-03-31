import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, FileText, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function DetectNews() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [newsContent, setNewsContent] = useState("");
  const [newsTitle, setNewsTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = trpc.news.analyzeNews.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to analyze news articles.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["text/plain", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a .txt or .pdf file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploadedFileName(file.name);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setNewsContent(content);
      setNewsTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      toast.success("File uploaded successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!newsContent.trim()) {
      toast.error("Please enter or upload news content");
      return;
    }

    if (newsContent.trim().length < 10) {
      toast.error("Content must be at least 10 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeMutation.mutateAsync({
        content: newsContent,
        title: newsTitle || "Untitled Article",
        fileType: uploadedFileName ? (uploadedFileName.endsWith(".pdf") ? "pdf" : "text") : "direct",
      });

      // Navigate to results page with the analysis ID
      navigate(`/analysis/${result.analysisId}`);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze news. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setNewsContent("");
    setNewsTitle("");
    setUploadedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analyze News Article</h1>
          <p className="text-muted-foreground">
            Paste your news content or upload a file to check if it's fake or real
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Input Area */}
          <div className="md:col-span-2 space-y-6">
            {/* Text Input */}
            <Card className="p-6 border-2 border-dashed border-border hover:border-accent/50 transition-colors">
              <label className="block mb-4">
                <span className="text-sm font-semibold text-muted-foreground mb-2 block">
                  News Content
                </span>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Paste your news article here... (minimum 10 characters)"
                  className="w-full h-64 p-4 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </label>
              <div className="text-sm text-muted-foreground">
                {newsContent.length} characters
              </div>
            </Card>

            {/* Title Input */}
            <Card className="p-6">
              <label className="block">
                <span className="text-sm font-semibold text-muted-foreground mb-2 block">
                  Article Title (Optional)
                </span>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Enter article title..."
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </label>
            </Card>

            {/* File Upload */}
            <Card className="p-6 border-2 border-dashed border-border hover:border-accent/50 transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Upload File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: .txt, .pdf (max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                {uploadedFileName && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    ✓ {uploadedFileName}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="p-6 space-y-3">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !newsContent.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze News"
                )}
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                Clear
              </Button>
            </Card>

            {/* Info Box */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">
                How It Works
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Paste or upload your news content</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Our AI analyzes the text using NLP</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Get instant FAKE or REAL verdict</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>View detailed analysis and metrics</span>
                </li>
              </ul>
            </Card>

            {/* Tips Box */}
            <Card className="p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">
                Tips for Better Results
              </h4>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li>• Use complete articles for accuracy</li>
                <li>• Include headlines and body text</li>
                <li>• Longer content = more reliable analysis</li>
                <li>• Multiple paragraphs recommended</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
