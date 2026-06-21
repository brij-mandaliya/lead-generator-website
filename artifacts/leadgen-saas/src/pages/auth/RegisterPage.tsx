// src/pages/auth/RegisterPage.tsx
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Users, ShieldCheck, Send, BarChart3, Sparkles, Target, Lightbulb, Megaphone, CheckCircle2 } from "lucide-react";
import { ProspectHiveLogo } from "@/components/ui/ProspectHiveLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRegister } from "@workspace/api-client-react";
import { useAuthStore } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const features = [
  {
    icon: Users,
    title: "Qualified Leads",
    description: "Accurate, verified and relevant leads that match your ideal customer profile.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Reliable",
    description: "We ensure high-quality data you can trust for outreach.",
  },
  {
    icon: Send,
    title: "Faster Outreach",
    description: "Spend less time searching and more time connecting with prospects.",
  },
  {
    icon: BarChart3,
    title: "Track & Grow",
    description: "Monitor performance and scale your sales pipeline consistently.",
  },
];

const FormCard = ({
  showPassword,
  setShowPassword,
  form,
  onSubmit,
  isPending,
}: {
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  form: any;
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
}) => {
  return (
    <div className="group w-full max-w-[560px] bg-background/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 p-10 focus-within:glow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="relative">
          <ProspectHiveLogo size={28} />
          <span className="absolute -inset-2 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <span className="font-bold text-lg">ProspectHive</span>
      </div>

      <h2 className="text-xl font-bold mb-1">Create Account</h2>
      <p className="text-sm text-muted-foreground mb-8">Get started with your free account</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Alex Johnson"
                    {...field}
                    data-testid="input-name"
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@company.com"
                    type="email"
                    {...field}
                    data-testid="input-email"
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
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
                <FormLabel>Company (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Acme Agency"
                    {...field}
                    data-testid="input-company"
                    className="transition-all duration-300 focus:scale-[1.02]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="6+ characters"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      data-testid="input-password"
                      className="pr-10 transition-all duration-300 focus:scale-[1.02]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 gradient-primary text-white border-0 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            disabled={isPending}
            data-testid="button-register"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background dark:bg-card px-3 text-xs text-muted-foreground">
          Or continue with
        </span>
      </div>

      <Button
        variant="outline"
        className="w-full h-11 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
        data-testid="button-google"
        onClick={() => { window.location.href = `${import.meta.env.VITE_API_URL || ""}/api/auth/google`; }}
      >
        <svg className="w-5 h-5 mr-2 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login">
          <span className="text-primary hover:underline cursor-pointer font-medium transition-all hover:scale-105 inline-block">Sign in</span>
        </Link>
      </p>
    </div>
  );
};

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const register = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", company: "" },
  });

  const onSubmit = (values: FormValues) => {
    register.mutate(
      { data: values },
      {
        onSuccess: (res: any) => {
          setAuth(res.user, res.token);
          setLocation("/dashboard");
        },
        onError: (err: any) => {
          toast({
            title: "Registration failed",
            description: err?.message || "Something went wrong. Try a different email.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/15 dark:bg-blue-500/10 blur-[120px] animate-[float_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 dark:bg-primary/5 blur-[100px] animate-[float_12s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-emerald-400/10 dark:bg-emerald-400/5 blur-[80px] animate-[float_7s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] rounded-full bg-teal-400/10 dark:bg-teal-400/5 blur-[90px] animate-[float_9s_ease-in-out_infinite_3s]" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Desktop layout */}
      <div className="hidden lg:flex min-h-screen relative z-10">
        <div className="w-[480px] min-h-screen flex-col p-12 bg-card/50 backdrop-blur-xl border-r border-border/30 relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="relative">
              <ProspectHiveLogo size={32} />
              <span className="absolute -inset-3 rounded-full bg-primary/20 blur-md" />
            </div>
            <span className="font-bold text-lg">ProspectHive</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-widest">Lead Generation Platform</span>
            </div>

            <h1 className="text-4xl font-black leading-tight mb-3 gradient-text">
              Everything You Need<br />to Win Clients
            </h1>
            <p className="text-muted-foreground mb-10">
              Supercharge your lead generation with verified, daily-delivered prospects.
            </p>

            <div className="space-y-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-3 group/item animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:scale-110 group-hover/item:glow-sm transition-all duration-300">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} ProspectHive. All rights reserved.
          </div>
        </div>

        {/* Right side — service showcase */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-primary/[0.03]" />

          {/* Floating service pills */}
          <div className="absolute top-12 right-10 animate-[drift_7s_ease-in-out_infinite]">
            <div className="px-4 py-2 rounded-2xl border border-primary/20 bg-primary/8 backdrop-blur-sm shadow-lg shadow-primary/5">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-primary" />
                <span className="text-xs font-semibold">Lead Generation</span>
              </div>
            </div>
          </div>

          <div className="absolute top-20 left-10 animate-[drift_9s_ease-in-out_infinite_1s]">
            <div className="px-4 py-2 rounded-2xl border border-purple-500/20 bg-purple-500/10 backdrop-blur-sm shadow-lg shadow-purple-500/5">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-purple-400" />
                <span className="text-xs font-semibold">Market Research</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-24 right-12 animate-[drift_8s_ease-in-out_infinite_2s]">
            <div className="px-4 py-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 backdrop-blur-sm shadow-lg shadow-amber-500/5">
              <div className="flex items-center gap-2">
                <Lightbulb size={14} className="text-amber-400" />
                <span className="text-xs font-semibold">Strategy Consulting</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 left-12 animate-[drift_10s_ease-in-out_infinite_0.5s]">
            <div className="px-4 py-2 rounded-2xl border border-green-500/20 bg-green-500/10 backdrop-blur-sm shadow-lg shadow-green-500/5">
              <div className="flex items-center gap-2">
                <Megaphone size={14} className="text-green-400" />
                <span className="text-xs font-semibold">Outreach Automation</span>
              </div>
            </div>
          </div>

          {/* Center content */}
          <div className="relative pl-20 pr-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/8 backdrop-blur-sm text-[11px] font-medium text-primary mb-6">
              <Sparkles size={12} />
              AI-Powered Lead Generation
            </div>

            <h2 className="text-4xl font-black leading-tight mb-4 gradient-text">
              Start Growing<br />Your Pipeline
            </h2>

            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-sm mx-auto mb-8">
              Join 1,200+ agencies and founders who wake up to fresh, verified leads every morning.
            </p>

            {/* Key metrics */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-black gradient-text">200+</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">Active Clients</div>
              </div>
              <div className="w-px h-8 bg-border/30" />
              <div className="text-center">
                <div className="text-2xl font-black gradient-text">3K+</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">Leads Delivered</div>
              </div>
              <div className="w-px h-8 bg-border/30" />
              <div className="text-center">
                <div className="text-2xl font-black gradient-text">42%</div>
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">Avg Close Rate</div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-8">
              {["No credit card required", "Cancel anytime", "Daily fresh leads"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop floating card */}
      <div className="hidden lg:block absolute left-[520px] top-1/2 -translate-y-1/2 z-20 animate-[fadeIn_0.8s_ease-out_forwards]">
        <FormCard showPassword={showPassword} setShowPassword={setShowPassword} form={form} onSubmit={onSubmit} isPending={register.isPending} />
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4 relative z-10">
        <FormCard showPassword={showPassword} setShowPassword={setShowPassword} form={form} onSubmit={onSubmit} isPending={register.isPending} />
      </div>

      {/* Keyframes for custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 30px) scale(1.02); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(12px, -18px) rotate(1deg); }
          40% { transform: translate(-8px, -8px) rotate(-0.5deg); }
          60% { transform: translate(16px, 10px) rotate(0.5deg); }
          80% { transform: translate(-10px, 12px) rotate(-1deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
