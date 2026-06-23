import { Link } from "wouter";
import {
  ArrowRight, Zap, Target, BarChart3, Shield, Users, TrendingUp,
  CheckCircle2, Star, ChevronRight, Play, ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListPlans } from "@workspace/api-client-react";
import { useEffect, useRef, useState } from "react";
import MarketingLayout from "@/components/layouts/MarketingLayout";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

function AnimatedStat({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const { ref, count } = useCountUp(value);
  return (
    <div className="text-center group">
      <div className="text-4xl md:text-5xl font-black tracking-tight mb-1 gradient-text" ref={ref}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "Email Outreach",
    desc: "Cookie-cutter templates get ignored. We write outreach that sounds like a human wrote it - because we did. Personalised, sequenced, and built to get replies.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "hover:shadow-amber-500/10",
  },
  {
    icon: Target,
    title: "Niche Targeting",
    desc: "Filter by tech stack, budget, country, and vertical. Stop wasting time on bad-fit prospects.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    glow: "hover:shadow-primary/10",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    desc: "Live stats, conversion tracking, and pipeline health, all in one beautifully simple place.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "hover:shadow-blue-500/10",
  },
  {
    icon: Shield,
    title: "Verified Leads Only",
    desc: "Not scraped data. Curated, hand-verified prospects actively searching for your services.",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    glow: "hover:shadow-green-500/10",
  },
  {
    icon: Users,
    title: "CRM-Like Tracking",
    desc: "Track every lead from new to closed. Add notes, update status, never lose context again.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "hover:shadow-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Automated Delivery",
    desc: "Fresh leads delivered to your dashboard every morning based on your plan tier — zero effort.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "hover:shadow-rose-500/10",
  },
];

const steps = [
  {
    step: "01",
    title: "Pick Your Plan",
    desc: "Choose the tier that matches your growth target. Upgrade or cancel anytime no lock-ins.",
    icon: CheckCircle2,
  },
  {
    step: "02",
    title: "Leads Hit Your Dashboard",
    desc: "Every morning, fresh high-intent prospects land in your pipeline, filtered for your niche.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Track, Close, Repeat",
    desc: "Update statuses, log notes, and watch your conversion rate climb week over week.",
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    name: "Michael Carter",
    role: "Business Development Manager",
    initials: "MC",
    color: "bg-primary/20 text-primary",
    text: "ProspectHive has significantly improved our outreach process. The leads are well-targeted, accurate, and have helped our sales team focus on conversations that actually matter.",
    rating: 3,
    metric: "Improved outreach",
  },
  {
    name: "Sarah Thompson",
    role: "Founder",
    initials: "ST",
    color: "bg-purple-500/20 text-purple-400",
    text: "We were spending hours searching for prospects manually. With ProspectHive, we receive relevant leads consistently, saving time and improving our team's productivity.",
    rating: 4,
    metric: "Saved hours weekly",
  },
  {
    name: "David Reynolds",
    role: "Sales Director",
    initials: "DR",
    color: "bg-amber-500/20 text-amber-400",
    text: "The quality of the lead data exceeded our expectations. Contact information was reliable, and the prospects closely matched our ideal customer profile.",
    rating: 4,
    metric: "Exceeded expectations",
  },
  {
    name: "Jennifer Wilson",
    role: "Marketing Consultant",
    initials: "JW",
    color: "bg-green-500/20 text-green-400",
    text: "Working with ProspectHive has streamlined our lead generation efforts. Their process is organized, transparent, and delivers genuine value for growing businesses.",
    rating: 5,
    metric: "Streamlined process",
  },
];

export default function HomePage() {
  const { data: plans } = useListPlans();

  return (
    <MarketingLayout>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.15),transparent)]" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 text-sm font-medium text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live leads updated daily
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
                We{" "}
                <span className="gradient-text">Fill Your Pipeline</span>
                <br />
                <span className="text-foreground">You Close the Deals.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                ProspectHive helps agencies and B2B teams build a steady stream of qualified leads - through sharp outreach, targeted prospecting, and strategy that actually converts.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/register">
                  <Button size="lg" className="gradient-primary text-white border-0 glow-sm h-12 px-8 text-base font-semibold group" data-testid="hero-cta-primary">
                    Book a Free Strategy Call
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base group" data-testid="hero-cta-secondary">
                    <Play className="mr-2 w-4 h-4 group-hover:text-primary transition-colors" />
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                {["No credit card required", "Cancel anytime", "Daily fresh leads"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Hero image */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-3xl scale-90" />
              <img
                src="/hero-section.jpeg"
                alt="ProspectHive Dashboard Preview"
                className="relative w-full h-auto rounded-2xl border border-border/60 shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-10 md:p-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <AnimatedStat value={200} suffix="+" label="Active Clients" />
              <AnimatedStat value={3000} suffix="+" label="Leads Delivered" />
              <AnimatedStat value={42} suffix="%" label="Avg Close Rate" />
              <AnimatedStat value={10} suffix="+" label="Countries Covered" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-20 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10">Why ProspectHive</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Every Tool Your Pipeline Needs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Built by growth operators who got tired of paying for data that doesn't convert.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`group relative p-6 rounded-2xl border ${f.border} ${f.bg} hover:shadow-xl ${f.glow} transition-all duration-300 hover:-translate-y-0.5 cursor-default`}
                >
                  <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className={`absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ArrowUpRight className={`w-4 h-4 ${f.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10">How It Works</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">From Sign-Up to Closed Deal</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">Three steps. No complexity. Just leads and revenue.</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40" />

            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex flex-col items-center text-center group">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 rounded-full bg-primary/10 border border-primary/30 group-hover:border-primary/60 group-hover:bg-primary/15 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-black">{i + 1}</span>
                    </div>
                  </div>
                  <div className="text-4xl font-black gradient-text mb-2 opacity-20 group-hover:opacity-40 transition-opacity absolute top-[-0.5rem] select-none">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="py-20 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10">Results</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">What Closers Are Saying</h2>
            <p className="text-muted-foreground text-lg">Real results from real customers. No fluff.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group p-7 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="text-4xl font-black text-primary/20 leading-none mb-4">"</div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-0.5 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${t.color} flex items-center justify-center font-bold text-sm`}>
                    {t.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="text-xs text-primary font-semibold bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                    {t.metric}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-24 bg-card/20 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-14 rounded-3xl border border-primary/30 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-500/8 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

            <Badge variant="secondary" className="mb-6 text-primary border-primary/30 bg-primary/10">Get Started Today</Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-5 relative tracking-tight">
              Ready to stop chasing leads and start closing them?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg relative leading-relaxed">
              Join 210+ agencies who've handed us the hard part - and watched their
              pipelines grow.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative">
              <Link href="/contact">
                <Button size="lg" className="gradient-primary text-white border-0 glow-sm h-13 px-10 text-base font-semibold group" data-testid="cta-final">
                    Let's Talk → Free 30-Min Call
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base">
                  Compare Plans
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

    </MarketingLayout>
  );
}
