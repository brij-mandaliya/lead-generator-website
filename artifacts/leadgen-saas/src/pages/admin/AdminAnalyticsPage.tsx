import { Users, Target, DollarSign, TrendingUp, UserCheck, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminAnalytics, useGetRevenueByMonth, useGetLeadsByCountry } from "@workspace/api-client-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useGetAdminAnalytics();
  const { data: revenue } = useGetRevenueByMonth();
  const { data: byCountry } = useGetLeadsByCountry();

  const stats = [
    { label: "Total Users", value: analytics?.totalUsers, icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Active Users", value: analytics?.activeUsers, icon: UserCheck, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { label: "Total Leads", value: analytics?.totalLeads, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Revenue", value: analytics?.totalRevenue ? `$${analytics.totalRevenue.toFixed(0)}` : undefined, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "New Users (Month)", value: analytics?.newUsersThisMonth, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Revenue (Month)", value: analytics?.revenueThisMonth ? `$${analytics.revenueThisMonth.toFixed(0)}` : undefined, icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide performance metrics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`p-4 rounded-xl border ${stat.border} ${stat.bg}`} data-testid={`admin-stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}>
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                {isLoading ? <Skeleton className="h-8 w-16 mb-1" /> : (
                  <div className={`text-2xl font-black ${stat.color} stat-counter`}>{stat.value ?? "—"}</div>
                )}
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          {revenue && revenue.length > 0 && (
            <div className="p-5 rounded-xl border border-border/50 bg-card">
              <h3 className="text-sm font-semibold mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v: any) => [`$${v}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {revenue.map((_, i) => <Cell key={i} fill={`hsl(221 83% ${40 + i * 3}%)`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Leads by Country */}
          {byCountry && byCountry.length > 0 && (
            <div className="p-5 rounded-xl border border-border/50 bg-card">
              <h3 className="text-sm font-semibold mb-4">Leads by Country</h3>
              <div className="space-y-3">
                {byCountry.slice(0, 6).map((item, i) => {
                  const max = byCountry[0]?.count || 1;
                  const pct = Math.round((item.count / max) * 100);
                  return (
                    <div key={item.country} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{item.country}</span>
                        <span className="text-muted-foreground">{item.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
