import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, CheckCircle2, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useGetMe, getGetMeQueryKey, useUpdateUser, useListPlans } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  company: z.string().optional(),
  services: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user, setAuth } = useAuthStore();
  const { data: me } = useGetMe();
  const updateUser = useUpdateUser();
  const { data: plans, isLoading: plansLoading } = useListPlans();

  const currentPlanId = (me as any)?.planId;
  const activePlans = plans?.filter((p) => p.isActive) || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", company: "", services: "" },
  });

  useEffect(() => {
    if (me) {
      form.reset({
        name: (me as any).name || "",
        phone: (me as any).phone || "",
        company: (me as any).company || "",
        services: (me as any).services || "",
      });
    }
  }, [me]);

  const onSubmit = (values: FormValues) => {
    const userId = (me as any)?.id;
    if (!userId) return;
    updateUser.mutate(
      { userId, data: values },
      {
        onSuccess: (updated: any) => {
          qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
          if (user) {
            setAuth({ ...user, ...updated }, localStorage.getItem("lf_token") || "");
          }
          toast({ title: "Profile updated" });
        },
        onError: () => {
          toast({ title: "Update failed", variant: "destructive" });
        },
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Profile Settings */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-black">Profile Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Update your account information</p>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-card">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-black text-primary">{(me as any)?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="font-semibold" data-testid="profile-name">{(me as any)?.name}</div>
                <div className="text-sm text-muted-foreground">{(me as any)?.email}</div>
                <div className="text-xs text-primary mt-0.5 capitalize">{(me as any)?.role}</div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555 0100" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Agency" {...field} data-testid="input-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Services Offered</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Web development, SEO, SaaS" {...field} data-testid="textarea-services" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="gradient-primary text-white border-0"
                    disabled={updateUser.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateUser.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black">Subscription</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose the plan that matches your growth goals</p>
          </div>

          {/* Current Plan Banner */}
          {(me as any)?.plan && (
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Current Plan: <span className="text-primary">{(me as any).plan.name}</span></div>
                  <div className="text-xs text-muted-foreground">{(me as any).plan.leadsPerDay} leads/day · ${(me as any).plan.price}/month</div>
                </div>
              </div>
              <Badge className="bg-green-500/15 text-green-400 border-green-500/20">Active</Badge>
            </div>
          )}

          {/* Plan Cards */}
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
                      <span className="text-4xl font-black">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground mb-4">{plan.leadsPerDay} leads per day</div>

                    <ul className="space-y-2 mb-6">
                      {(plan.features || []).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${isCurrent ? "cursor-default" : isPopular ? "gradient-primary text-white border-0" : ""}`}
                      variant={isCurrent ? "secondary" : isPopular ? "default" : "outline"}
                      disabled={isCurrent}
                      onClick={() => !isCurrent && toast({ title: "Contact support to upgrade", description: "Reach out to our team to change your plan." })}
                      data-testid={`button-select-plan-${plan.id}`}
                    >
                      {isCurrent ? "Current Plan" : "Select Plan"}
                    </Button>
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

      </div>
    </DashboardLayout>
  );
}
