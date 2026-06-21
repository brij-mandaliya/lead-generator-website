import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LayoutDashboard, Users, Target, CreditCard, Package, LogOut, Menu, ChevronRight, Shield,
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

const adminNav: NavItem[] = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/plans", label: "Plans", icon: Package },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, clearAuth } = useAuthStore();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => clearAuth() });
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
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
          <Shield className="w-3 h-3" />
          Admin Panel
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {adminNav.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                  data-testid={`admin-nav-${item.label.toLowerCase()}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-400">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-amber-400/80">Administrator</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          data-testid="button-admin-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-60 border-r border-amber-500/20 bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-sidebar border-r border-amber-500/20 z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-14 px-4 border-b border-amber-500/20 bg-background/50 backdrop-blur-sm flex-shrink-0">
          <button className="md:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <Shield className="w-3 h-3" />
              Admin Mode
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
