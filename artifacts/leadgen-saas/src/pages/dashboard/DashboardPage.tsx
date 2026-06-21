import { Target, Zap, ArrowRight, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardSummary, useGetRecentLeads } from "@workspace/api-client-react";
import { useAuthStore } from "@/lib/auth";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: recentLeads } = useGetRecentLeads({ params: { limit: 5 } });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">
              Good morning, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {summary?.newLeadsToday !== undefined ? (
                <><span className="text-foreground font-medium">{summary.newLeadsToday} new leads</span> since you last checked</>
              ) : "Your command center is ready"}
            </p>
          </div>
          <Link href="/dashboard/leads">
            <Button size="sm" className="gradient-primary text-white border-0 hidden sm:flex" data-testid="button-view-leads">
              View All Leads
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stat Cards — Total Leads + Today's Leads */}
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/10" data-testid="stat-total-leads">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
              <Target className="w-4 h-4 text-primary" />
            </div>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-black text-primary stat-counter">{summary?.totalLeads ?? "—"}</div>
            )}
            <div className="text-xs text-muted-foreground">Total Leads</div>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10" data-testid="stat-new-today">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : (
              <div className="text-2xl font-black text-amber-400 stat-counter">{summary?.newLeadsToday ?? "—"}</div>
            )}
            <div className="text-xs text-muted-foreground">New Today</div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Leads</h3>
            <Link href="/dashboard/leads">
              <span className="text-xs text-primary hover:underline cursor-pointer">View all</span>
            </Link>
          </div>
          {recentLeads && recentLeads.length > 0 ? (
            <div className="divide-y divide-border/30">
              {recentLeads.map((lead: any) => (
                <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
                  <div className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/30 transition-colors cursor-pointer" data-testid={`lead-row-${lead.id}`}>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{lead.companyName}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.personName && (
                          <span className="flex items-center gap-1"><User className="w-3 h-3 inline" /> {lead.personName}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p>No leads yet. Upgrade your plan to start receiving leads.</p>
              <Link href="/dashboard/profile">
                <Button size="sm" variant="outline" className="mt-3">View Plans</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
