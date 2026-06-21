import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPayments } from "@workspace/api-client-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { formatPrice } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-500/15 text-green-400 border-green-500/20",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function PaymentsPage() {
  const { data, isLoading } = useListPayments({ params: {} });
  const payments = data?.payments || [];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-black">Billing History</h1>
          <p className="text-sm text-muted-foreground mt-1">Your payment records</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/20">
                      <td className="px-4 py-3"><Skeleton className="h-5 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    </tr>
                  ))
                ) : payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/20 hover:bg-secondary/20" data-testid={`payment-row-${p.id}`}>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.amount, p.currency)}</td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs capitalize border ${STATUS_STYLES[p.status] || ""}`}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && payments.length === 0 && (
            <div className="py-16 text-center">
              <CreditCard className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No payment history yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
