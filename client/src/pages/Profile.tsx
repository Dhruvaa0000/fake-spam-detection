import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, Loader2, User, Mail, Calendar, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  const { data: analytics, isLoading } = trpc.news.getAnalytics.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!isAuthenticated || !user) {
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
          <p className="text-muted-foreground">Loading profile...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your statistics
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="md:col-span-2 space-y-6">
            {/* User Information */}
            <Card className="p-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 rounded-full ai-gradient flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{user.name || "User"}</h2>
                  <p className="text-muted-foreground">{user.email || "No email"}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4">Account Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Signed In</p>
                      <p className="font-medium">
                        {new Date(user.lastSignedIn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Your Statistics</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {analytics?.totalAnalyses || 0}
                  </p>
                  <p className="text-muted-foreground">Total Analyses</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {analytics?.realCount || 0}
                  </p>
                  <p className="text-muted-foreground">Real News Found</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {analytics?.fakeCount || 0}
                  </p>
                  <p className="text-muted-foreground">Fake News Detected</p>
                </div>
              </div>
            </Card>

            {/* Activity Summary */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Average Confidence</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analytics?.averageConfidence || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">Fake News Percentage</span>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {analytics?.fakePercentage || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Real News Percentage</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analytics?.realPercentage || 0}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/detect")}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Analyze News
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/history")}
                  className="w-full"
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/analytics")}
                  className="w-full"
                >
                  View Analytics
                </Button>
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Save analysis history</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Dark mode</span>
                </label>
              </div>
            </Card>

            {/* Logout */}
            <Card className="p-6">
              <Button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </Button>
            </Card>

            {/* Support */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">
                Need Help?
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Check out our documentation or contact support for assistance.
              </p>
              <Button
                variant="outline"
                className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
