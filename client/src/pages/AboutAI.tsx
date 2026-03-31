import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Brain, Zap, BookOpen, Code2, BarChart3, Shield } from "lucide-react";

export default function AboutAI() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6">
            <div className="ai-gradient rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">How Our AI Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the advanced Natural Language Processing and Machine Learning techniques powering our fake news detection system
          </p>
        </div>

        {/* NLP Techniques Section */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Natural Language Processing (NLP) Techniques
          </h2>

          <div className="space-y-8">
            {/* Tokenization */}
            <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-6">
              <h3 className="text-2xl font-semibold mb-3">1. Tokenization</h3>
              <p className="text-muted-foreground mb-4">
                Tokenization is the process of breaking down text into individual words or tokens. This is the first step in our NLP pipeline, where we convert raw text into manageable units for analysis.
              </p>
              <div className="bg-input rounded-lg p-4 font-mono text-sm">
                <p className="text-muted-foreground">Example:</p>
                <p className="text-accent mt-2">
                  "Breaking news today" → ["Breaking", "news", "today"]
                </p>
              </div>
            </div>

            {/* Stopword Removal */}
            <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-6">
              <h3 className="text-2xl font-semibold mb-3">2. Stopword Removal</h3>
              <p className="text-muted-foreground mb-4">
                Common words like "the", "a", "and", "is" don't carry significant meaning for fake news detection. We remove these stopwords to focus on meaningful content that distinguishes fake from real news.
              </p>
              <div className="bg-input rounded-lg p-4 font-mono text-sm">
                <p className="text-muted-foreground">Example:</p>
                <p className="text-accent mt-2">
                  ["Breaking", "news", "today"] → ["Breaking", "news", "today"]
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  (Removed: "a", "the", "is")
                </p>
              </div>
            </div>

            {/* TF-IDF */}
            <div className="border-l-4 border-green-600 dark:border-green-400 pl-6">
              <h3 className="text-2xl font-semibold mb-3">3. TF-IDF (Term Frequency-Inverse Document Frequency)</h3>
              <p className="text-muted-foreground mb-4">
                TF-IDF measures the importance of each word in the document. It calculates how frequently a word appears in the text (TF) and how unique it is across all documents (IDF). Words that appear frequently in the document but rarely in other documents are considered more important.
              </p>
              <div className="bg-input rounded-lg p-4">
                <p className="text-muted-foreground text-sm mb-3">Formula:</p>
                <p className="font-mono text-accent">
                  TF-IDF = (Word Frequency / Total Words) × log(Total Documents / Documents with Word)
                </p>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="border-l-4 border-red-600 dark:border-red-400 pl-6">
              <h3 className="text-2xl font-semibold mb-3">4. Sentiment Analysis</h3>
              <p className="text-muted-foreground mb-4">
                We analyze the emotional tone of the text by identifying positive and negative words. Fake news often uses extreme emotional language to manipulate readers, so sentiment analysis helps identify suspicious patterns.
              </p>
              <div className="bg-input rounded-lg p-4 space-y-2 text-sm">
                <p className="text-muted-foreground">Positive words: amazing, excellent, wonderful, success</p>
                <p className="text-muted-foreground">Negative words: terrible, awful, disaster, crisis</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Machine Learning Model Section */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Code2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            Machine Learning Model
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Algorithm: Logistic Regression with Feature Engineering</h3>
              <p className="text-muted-foreground mb-4">
                Our model uses Logistic Regression, a proven classification algorithm that predicts whether a piece of text is fake or real based on extracted features. We combine this with sophisticated feature engineering to capture patterns indicative of fake news.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-3">Features Analyzed</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Uppercase letter ratio</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Exclamation mark frequency</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Question mark count</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Average word length</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Unique word ratio</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Suspicious keyword presence</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-3">Suspicious Keywords</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Shocking, unbelievable</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Exclusive, breaking</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Exposed, secret</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Truth, finally revealed</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>You won't believe</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Must read, urgent</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* How It All Works Together */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
            The Complete Analysis Pipeline
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Input Text</h4>
                <p className="text-muted-foreground">You provide the news article text</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tokenization & Preprocessing</h4>
                <p className="text-muted-foreground">
                  Text is broken into tokens and stopwords are removed
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Feature Extraction</h4>
                <p className="text-muted-foreground">
                  TF-IDF scores and linguistic features are calculated
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Sentiment Analysis</h4>
                <p className="text-muted-foreground">
                  Emotional tone and sentiment are analyzed
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold mb-1">ML Model Prediction</h4>
                <p className="text-muted-foreground">
                  Logistic Regression model classifies as FAKE or REAL
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                6
              </div>
              <div>
                <h4 className="font-semibold mb-1">Confidence Scoring</h4>
                <p className="text-muted-foreground">
                  A confidence percentage (0-100%) is calculated
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full ai-gradient flex items-center justify-center text-white font-bold">
                7
              </div>
              <div>
                <h4 className="font-semibold mb-1">Results & Explanation</h4>
                <p className="text-muted-foreground">
                  Verdict, confidence, and detailed analysis are presented
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Accuracy & Limitations */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              Strengths
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Detects sensationalism and emotional manipulation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Identifies suspicious keyword patterns</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Fast real-time analysis</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Works across multiple languages</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Provides detailed explanations</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              Limitations
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
                <span>Cannot verify factual accuracy of claims</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
                <span>Works best with longer articles</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
                <span>May struggle with satire and irony</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
                <span>Requires human verification for critical decisions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
                <span>Continuously learning and improving</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Detect Fake News?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start using our AI-powered fake news detector to analyze articles and understand the techniques behind misinformation.
          </p>
          <Button
            onClick={() => navigate("/detect")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg"
          >
            Analyze News Now
          </Button>
        </div>
      </div>
    </div>
  );
}
