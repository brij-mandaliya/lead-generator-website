import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuthStore } from "@/lib/auth";

// Marketing
import HomePage from "@/pages/marketing/HomePage";
import ServicesPage from "@/pages/marketing/ServicesPage";
import PricingPage from "@/pages/marketing/PricingPage";
import ContactPage from "@/pages/marketing/ContactPage";
import AboutPage from "@/pages/marketing/AboutPage";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";

// Dashboard
import DashboardPage from "@/pages/dashboard/DashboardPage";
import LeadsPage from "@/pages/dashboard/LeadsPage";
import LeadDetailPage from "@/pages/dashboard/LeadDetailPage";
import PaymentsPage from "@/pages/dashboard/PaymentsPage";
import ProfilePage from "@/pages/dashboard/ProfilePage";

// Admin
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminLeadsPage from "@/pages/admin/AdminLeadsPage";
import AdminPlansPage from "@/pages/admin/AdminPlansPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Redirect to="/login" />;
  if (requireAdmin && user.role !== "admin") return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (user) return <Redirect to={user.role === "admin" ? "/admin" : "/dashboard"} />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Marketing */}
      <Route path="/" component={HomePage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/about" component={AboutPage} />

      {/* Auth */}
      <Route path="/login">
        <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
      </Route>
      <Route path="/register">
        <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>
      </Route>
      <Route path="/auth/callback" component={AuthCallbackPage} />

      {/* Dashboard */}
      <Route path="/dashboard">
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/leads">
        <ProtectedRoute><LeadsPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/leads/:leadId">
        {(params: any) => (
          <ProtectedRoute><LeadDetailPage leadId={params.leadId} /></ProtectedRoute>
        )}
      </Route>
      <Route path="/dashboard/plan">
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/payments">
        <ProtectedRoute><PaymentsPage /></ProtectedRoute>
      </Route>
      <Route path="/dashboard/profile">
        <ProtectedRoute><ProfilePage /></ProtectedRoute>
      </Route>

      {/* Admin */}
      <Route path="/admin">
        <ProtectedRoute requireAdmin><AdminAnalyticsPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/leads">
        <ProtectedRoute requireAdmin><AdminLeadsPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/plans">
        <ProtectedRoute requireAdmin><AdminPlansPage /></ProtectedRoute>
      </Route>
      <Route path="/admin/payments">
        <ProtectedRoute requireAdmin><AdminPaymentsPage /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
