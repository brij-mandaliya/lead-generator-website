import { CheckCircle2, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPlans, useGetMe } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { formatPrice } from "@/lib/utils";
import { loadRazorpayScript, showRazorpayCheckout } from "@/lib/razorpay";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function PlanPage() {
  const { toast } = useToast();
  const { data: plans, isLoading: plansLoading } = useListPlans();
  const { data: me } = useGetMe();

  const currentPlanId = (me as any)?.planId;
  const activePlans = plans?.filter((p) => p.isActive) || [];

  const handleUpgradePlan = async (plan: any) => {
    try {
      // Show loading state
      toast({
        title: "Initializing payment...",
        description: "Please wait while we prepare your payment."
      });

      // 1. Get Razorpay key from backend
      const keyResponse = await fetch(`${API_BASE}/api/payments/key`);
      if (!keyResponse.ok) {
        throw new Error('Failed to get Razorpay key');
      }
      const { key } = await keyResponse.json();
      
      // 2. Create order via backend
      const orderResponse = await fetch(`${API_BASE}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id })
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }
      const order = await orderResponse.json();
      
      // 3. Show Razorpay checkout
      await showRazorpayCheckout({
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Lead Generator',
        description: `Upgrade to ${plan.name} plan`,
        order_id: order.id,
        handler: async (response) => {
          // Payment successful - verify with backend
          const verifyResponse = await fetch(`${API_BASE}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: plan.id,
            }),
          });

          if (verifyResponse.ok) {
            toast({
              title: "Payment Successful!",
              description: `Your ${plan.name} plan is now active. Check your email for your Google Sheet link.`
            });
          } else {
            const err = await verifyResponse.json();
            toast({
              title: "Verification Pending",
              description: err.error || "Payment was captured but verification needs time. We'll update your account shortly."
            });
          }
          // Reload the page to reflect the new plan
          window.location.reload();
        },
        prefill: {
          name: me?.name,
          email: me?.email,
        }
      });
    } catch (error) {
      console.error('Razorpay checkout failed:', error);
      toast({
        title: "Payment Failed",
        description: "We couldn't process your payment. Please try again or contact support."
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-black">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose the plan that matches your growth goals</p>
        </div>

        {/* Current Plan */}
        {(me as any)?.plan && (
          <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold">Current Plan: <span className="text-primary">{(me as any).plan.name}</span></div>
                <div className="text-xs text-muted-foreground">{(me as any).plan.leadsPerDay} leads/day · {formatPrice((me as any).plan.price, (me as any).plan.currency)}/month</div>
              </div>
            </div>
            <Badge className="bg-green-500/15 text-green-400 border-green-500/20">Active</Badge>
          </div>
        )}

        {plansLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {activePlans.map((plan, idx) => {
              const isPopular = idx === 1;
              const isCurrent = plan.id === currentPlanId;

              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-xl border transition-all ${
                    isCurrent ? "border-green-500/40 bg-green-500/5" :
                    isPopular ? "border-primary/40 bg-primary/5 glow-primary" :
                    "border-border/50 bg-card hover:border-border"
                  }`}
                  data-testid={`plan-card-${plan.id}`}
                >
                  {isPopular && !isCurrent && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <div className="gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Most Popular
                      </div>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <div className="bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full">Current Plan</div>
                    </div>
                  )}

                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black">{formatPrice(plan.price, plan.currency)}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground mb-4">{plan.leadsPerDay} opportunities per day</div>

                  <ul className="space-y-2 mb-6">
                    {(plan.features || []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex space-x-3">
                    <Button
                      className={`w-full ${isCurrent ? "cursor-default" : isPopular ? "gradient-primary text-white border-0" : ""}`}
                      variant={isCurrent ? "secondary" : isPopular ? "default" : "outline"}
                      disabled={isCurrent}
                      onClick={() => !isCurrent && handleUpgradePlan(plan)}
                      data-testid={`button-select-plan-${plan.id}`}
                    >
                      {isCurrent ? "Current Plan" : "Upgrade to Plan"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-5 rounded-xl border border-border/50 bg-card text-center">
          <p className="text-sm text-muted-foreground">Need a custom plan for your team?</p>
          <Button variant="link" className="text-primary mt-1">Contact us for Enterprise pricing</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
