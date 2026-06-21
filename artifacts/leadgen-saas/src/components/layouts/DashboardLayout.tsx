import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LayoutDashboard, Target, CreditCard, User, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { ProspectHiveLogo } from "@/components/ui/ProspectHiveLogo";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { useLogout } from "@workspace/api-client-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const userNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "My Leads", icon: Target },
  { href: "/dashboard/payments", label: "Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, clearAuth } = useAuthStore();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        clearAuth();
      },
    });
    clearAuth();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <ProspectHiveLogo size={28} />
            <span className="font-bold text-foreground">ProspectHive</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
        <nav className="space-y-1">
          {userNav.map((item) => {
            const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer group ${
                    isActive
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                  data-testid={`sidebar-${item.label.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        {user?.plan && (
          <div className="mb-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-xs text-primary font-semibold">{user.plan.name} Plan</div>
            <div className="text-xs text-muted-foreground mt-0.5">{user.plan.leadsPerDay} leads/day</div>
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" data-testid="sidebar-user-name">{user?.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border/50 bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-sidebar border-r border-border/50 z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-14 px-4 border-b border-border/50 bg-background/50 backdrop-blur-sm flex-shrink-0">
          <button
            className="md:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground" data-testid="header-user-name">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
