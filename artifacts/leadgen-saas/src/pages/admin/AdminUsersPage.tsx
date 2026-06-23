import { useState } from "react";
import { Search, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListUsers,
  getListUsersQueryKey,
  useUpdateUserStatus,
  useAssignUserPlan,
  useListPlans,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const params: any = { page, limit: LIMIT };
  if (search) params.search = search;
  if (statusFilter !== "all") params.status = statusFilter;

  const { data, isLoading } = useListUsers({ params });
  const { data: plans } = useListPlans();
  const updateStatus = useUpdateUserStatus();
  const assignPlan = useAssignUserPlan();

  const allUsers = data?.users || [];
  const users = allUsers.filter(user => user.email !== "admin@prospecthive.app");
  const total = data?.total || 0;

  const handleToggleStatus = (userId: number, isActive: boolean) => {
    updateStatus.mutate(
      { userId, data: { isActive: !isActive } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListUsersQueryKey(params) });
          toast({ title: `User ${!isActive ? "activated" : "deactivated"}` });
        },
      }
    );
  };

  const handleAssignPlan = (userId: number, planId: string) => {
    assignPlan.mutate(
      { userId, data: { planId: parseInt(planId, 10) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListUsersQueryKey(params) });
          toast({ title: "Plan assigned" });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">User Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} total users</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
              data-testid="input-search-users"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-36" data-testid="select-user-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/20">
                        <td className="px-4 py-3"><Skeleton className="h-5 w-36" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-7 w-28" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-7 w-20" /></td>
                      </tr>
                    ))
                  : users.map((user: any) => (
                      <tr key={user.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors" data-testid={`user-row-${user.id}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.company || "—"}</td>
                        <td className="px-4 py-3">
                          {plans && (
                            <Select
                              value={user.planId?.toString() || ""}
                              onValueChange={(v) => handleAssignPlan(user.id, v)}
                            >
                              <SelectTrigger className="h-7 text-xs w-32" data-testid={`select-plan-${user.id}`}>
                                <SelectValue placeholder="No plan" />
                              </SelectTrigger>
                              <SelectContent>
                                {plans.filter((p) => p.isActive).map((plan) => (
                                  <SelectItem key={plan.id} value={plan.id.toString()}>{plan.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${user.isActive ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-red-500/15 text-red-400 border-red-500/20"}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`text-xs h-7 ${user.isActive ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}`}
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                            data-testid={`button-toggle-user-${user.id}`}
                          >
                            {user.isActive ? <><UserX className="w-3 h-3 mr-1" />Deactivate</> : <><UserCheck className="w-3 h-3 mr-1" />Activate</>}
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {!isLoading && users.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No users found</div>
          )}
        </div>

        {total > LIMIT && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-sm text-muted-foreground py-2 px-3">Page {page} of {Math.ceil(total / LIMIT)}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}>Next</Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
