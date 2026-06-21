import { useEffect, useRef, useState } from "react";
import {
  Target, Eye, Quote, Star, ArrowRight,
  Users, Zap, Globe, Shield,
  BarChart3, Sparkles, ChevronRight,
  Building2, TrendingUp, Award,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MarketingLayout from "@/components/layouts/MarketingLayout";

function useCountUp(end: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || counted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { value, ref };
}

function animateIn(index: number) {
  return `opacity-0 animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards` +
    ` animation-delay-${index * 100}`;
}

const stats = [
  { icon: Building2, value: 500, suffix: "+", label: "Businesses Served" },
  { icon: Users, value: 50, suffix: "K+", label: "Leads Generated" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Lead Accuracy" },
  { icon: Award, value: 4.9, suffix: "/5", label: "Client Rating" },
];

const values = [
  {
    title: "Accuracy First",
    desc: "Every lead is verified before it reaches your pipeline. No outdated contacts, no wasted outreach.",
    icon: Target,
    color: "from-primary/30 to-primary/10 border-primary/30",
    iconBg: "bg-primary/15 text-primary",
  },
  {
    title: "Radical Transparency",
    desc: "No hidden data sources. You always know where your leads come from and how they were qualified.",
    icon: Eye,
    color: "from-purple-500/30 to-purple-500/10 border-purple-500/30",
    iconBg: "bg-purple-500/15 text-purple-400",
  },
  {
    title: "Client-Focused",
    desc: "Your growth goals define our approach. We adapt to your niche, not the other way around.",
    icon: Users,
    color: "from-amber-500/30 to-amber-500/10 border-amber-500/30",
    iconBg: "bg-amber-500/15 text-amber-400",
  },
  {
    title: "Continuous Improvement",
    desc: "We refine our data sources and scoring models constantly so you get better leads every week.",
    icon: BarChart3,
    color: "from-green-500/30 to-green-500/10 border-green-500/30",
    iconBg: "bg-green-500/15 text-green-400",
  },
  {
    title: "Data Security",
    desc: "Your data is encrypted and never shared. Enterprise-grade security is standard, not an add-on.",
    icon: Shield,
    color: "from-blue-500/30 to-blue-500/10 border-blue-500/30",
    iconBg: "bg-blue-500/15 text-blue-400",
  },
  {
    title: "Speed & Scale",
    desc: "Real-time lead delivery at any volume. From 10 leads a week to 10,000 — our infrastructure scales instantly.",
    icon: Zap,
    color: "from-rose-500/30 to-rose-500/10 border-rose-500/30",
    iconBg: "bg-rose-500/15 text-rose-400",
  },
];

const reviews = [
  {
    name: "James K.",
    role: "Agency Owner",
    initials: "JK",
    gradient: "from-primary/20 to-primary/5",
    border: "border-primary/20",
    text: "We closed 3 new clients in the first week. ProspectHive delivers exactly what it promises — real, high-intent leads ready to buy.",
    rating: 5,
    metric: "+3 clients in week 1",
  },
  {
    name: "Priya M.",
    role: "SaaS Founder",
    initials: "PM",
    gradient: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
    text: "The CRM-like tracking changed how our team operates. We went from spreadsheets to a real pipeline in under 10 minutes.",
    rating: 5,
    metric: "10-min onboarding",
  },
  {
    name: "Carlos R.",
    role: "IT Consultant",
    initials: "CR",
    gradient: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/20",
    text: "Best ROI of any tool I've subscribed to. The niche targeting is scary accurate — these people actually need my services.",
    rating: 5,
    metric: "Highest ROI tool",
  },
  {
    name: "Sarah L.",
    role: "Marketing Director",
    initials: "SL",
    gradient: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    text: "The lead quality is night and day compared to other providers. Our sales team actually looks forward to prospecting now.",
    rating: 5,
    metric: "2x pipeline velocity",
  },
  {
    name: "Marcus T.",
    role: "Startup CEO",
    initials: "MT",
    gradient: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/20",
    text: "ProspectHive helped us identify our ideal customer profile faster than any consulting engagement could have.",
    rating: 5,
    metric: "3 weeks to ICP clarity",
  },
  {
    name: "Anika P.",
    role: "Growth Lead",
    initials: "AP",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
    text: "The automated delivery is a game changer. I open my dashboard every morning to fresh, relevant leads without lifting a finger.",
    rating: 5,
    metric: "30+ hrs saved monthly",
  },
];

function StatCard({ icon: Icon, value, suffix, label }: { icon: React.ElementType; value: number; suffix: string; label: string }) {
  const { value: count, ref } = useCountUp(value);
  return (
    <div className="group relative p-6 md:p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 text-center">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <span ref={ref} className="text-4xl md:text-5xl font-black stat-counter gradient-text">
          {count}{suffix}
        </span>
        <p className="text-sm text-muted-foreground mt-2 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.15),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />

          {/* Decorative dots */}
          <div className="absolute top-32 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 text-primary border-primary/30 bg-primary/10 px-4 py-1.5 text-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
                About Us
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
                Building the Future of{" "}
                <span className="gradient-text">Lead Generation</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                At ProspectHive, we help startups and growing businesses connect with qualified prospects
                through accurate and reliable lead generation. Our focus is on delivering relevant business
                contacts that match your target audience, helping your sales team spend less time searching
                and more time building meaningful conversations.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8">
                <Link href="/register">
                  <Button size="lg" className="gradient-primary text-white border-0 glow-sm h-12 px-8 text-base font-semibold group">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base group">
                    Explore Services
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Stats preview card */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-2xl rotate-12 blur-sm" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/15 rounded-full blur-xl" />
                <div className="relative p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Why ProspectHive?</div>
                      <div className="text-xs text-muted-foreground">In a nutshell</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Shield, text: "Verified leads, zero duplicates" },
                      { icon: Zap, text: "Real-time delivery to your pipeline" },
                      { icon: Globe, text: "Cover 50+ industries globally" },
                      { icon: BarChart3, text: "AI-powered lead scoring" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-16 bg-card/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10 px-4 py-1.5">
              Why We Exist
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Our <span className="gradient-text">Mission & Vision</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every decision we make is guided by a clear sense of purpose and a bold vision for the future.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="group relative p-8 md:p-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                To help businesses generate better sales opportunities by providing accurate,
                verified, and relevant leads that support sustainable growth.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-primary font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                Driving results since 2024
              </div>
            </div>

            <div className="group relative p-8 md:p-10 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-purple-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">Our Vision</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                To become a trusted lead generation partner for businesses worldwide by delivering
                reliable data, transparent processes, and measurable value.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-purple-400 font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-slow" />
                10,000+ businesses by 2028
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story ───────────────────────────────────────── */}
      <section className="py-24 bg-card/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10 px-4 py-1.5">
              Our Story
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              From a Simple Idea to a{" "}
              <span className="gradient-text">Movement</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              ProspectHive was born from a frustration shared by every sales team — bad data.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 md:pl-12 border-l-2 border-primary/30 space-y-12">
              {[
                {
                  year: "2024",
                  title: "The Spark",
                  desc: "Two co-founders realized that 60% of B2B leads are outdated within a month. They set out to build a better way.",
                  icon: Zap,
                },
                {
                  year: "Early 2025",
                  title: "First 100 Customers",
                  desc: "After months of building, ProspectHive onboarded its first 100 customers — all through word of mouth.",
                  icon: Users,
                },
                {
                  year: "Mid 2025",
                  title: "AI-Powered Scoring",
                  desc: "Launched our proprietary AI scoring engine, boosting lead conversion rates by an average of 3.2x for early adopters.",
                  icon: BarChart3,
                },
                {
                  year: "2026",
                  title: "Global Expansion",
                  desc: "Now serving businesses in 50+ industries across 30 countries. Our team of 40+ is spread across 12 countries.",
                  icon: Globe,
                },
              ].map((item, i) => (
                <div key={item.year} className="relative group">
                  <div className="absolute -left-[calc(3rem+6px)] md:-left-[calc(3.25rem+6px)] top-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
                    <Badge variant="secondary" className="mb-3 text-primary border-primary/30 bg-primary/10">
                      {item.year}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10 px-4 py-1.5">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              What <span className="gradient-text">Drives</span> Us
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Six principles that guide every decision we make.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className={`group relative p-6 md:p-8 rounded-2xl border bg-gradient-to-br ${v.color} hover:-translate-y-1 transition-all duration-500`}
              >
                <div className="absolute inset-0 rounded-2xl bg-card/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl ${v.iconBg} border border-current/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── Reviews ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10 px-4 py-1.5">
              <Star className="w-3.5 h-3.5 mr-1.5 inline-block fill-primary text-primary" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Trusted by Growth Teams{" "}
              <span className="gradient-text">Everywhere</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Hear from the founders, agency owners, and sales leaders who use ProspectHive daily.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.name}
                className={`group relative p-7 rounded-2xl border ${r.border} bg-gradient-to-br ${r.gradient} hover:-translate-y-1 transition-all duration-500 flex flex-col`}
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="relative mb-5 flex-1">
                  <Quote className="w-8 h-8 text-primary/15 absolute -top-2 -left-2" />
                  <p className="text-sm text-muted-foreground leading-relaxed pl-5 relative z-10">
                    "{r.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border/30 mt-auto">
                  <Avatar className="w-10 h-10 ring-2 ring-primary/10">
                    <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                      {r.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs text-primary font-semibold bg-primary/10 border-primary/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {r.metric}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-24 bg-card/20 border-y border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 md:p-16 rounded-3xl border border-primary/30 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />

            {/* Floating decorative elements */}
            <div className="absolute top-0 left-1/4 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-500/8 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "2s" }} />

            <div className="relative">
              <Badge variant="secondary" className="mb-6 text-primary border-primary/30 bg-primary/10 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block" />
                Get Started Today
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                Ready to <span className="gradient-text">Transform</span> Your Lead Generation?
              </h2>
              <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                Join hundreds of businesses that trust ProspectHive to deliver the leads that fuel their growth.
                Start with a free trial — no credit card required.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="gradient-primary text-white border-0 glow-sm h-12 px-10 text-base font-semibold group">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="h-12 px-10 text-base group">
                    Talk to Our Team
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                No credit card required · Cancel anytime · 7-day free trial
              </p>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
