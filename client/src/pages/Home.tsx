import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Brain, CheckCircle2, BarChart3, History, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleCheckNews = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    } else {
      navigate("/detect");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold ai-gradient-text">FakeNews Detector</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/detect")}
                  className="text-foreground hover:bg-accent/10"
                >
                  Analyze
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/history")}
                  className="text-foreground hover:bg-accent/10"
                >
                  History
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/analytics")}
                  className="text-foreground hover:bg-accent/10"
                >
                  Analytics
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                  className="text-foreground hover:bg-accent/10"
                >
                  Profile
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <div className="ai-gradient rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            AI Fake News Detection System
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Harness the power of Natural Language Processing and Machine Learning to verify the authenticity of news articles in real-time. Get instant verdicts with confidence scores and detailed analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleCheckNews}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Check News Now
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/about")}
              className="px-8 py-6 text-lg font-semibold rounded-lg border-2"
            >
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-card rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
              <p className="text-muted-foreground">
                Get real-time predictions with confidence percentages and detailed explanations.
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Track your analysis history and view comprehensive statistics on fake vs real news.
              </p>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border hover:border-accent/50 transition-colors">
              <Shield className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your data is encrypted and secure. We never share your analysis history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full ai-gradient flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Paste or Upload</h3>
                <p className="text-muted-foreground">
                  Paste your news article directly or upload a .txt or .pdf file containing the content you want to verify.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full ai-gradient flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced NLP engine analyzes the text using tokenization, TF-IDF, and machine learning models to detect patterns.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full ai-gradient flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
                <p className="text-muted-foreground">
                  Get a clear FAKE or REAL verdict with confidence percentage, sentiment analysis, and extracted keywords.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full ai-gradient flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Track History</h3>
                <p className="text-muted-foreground">
                  All your analyses are saved in your history. View detailed insights and analytics about your fact-checking journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Detect Fake News?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start analyzing news articles now and build your fact-checking skills with our AI-powered system.
          </p>
          <Button
            onClick={handleCheckNews}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Analyzing
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate("/detect")}
                    className="hover:text-foreground transition-colors"
                  >
                    Analyze
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-foreground transition-colors"
                  >
                    About AI
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate("/profile")}
                    className="hover:text-foreground transition-colors"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/history")}
                    className="hover:text-foreground transition-colors"
                  >
                    History
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-foreground transition-colors"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="hover:text-foreground transition-colors"
                  >
                    NLP Guide
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2026 AI Fake News Detector. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
