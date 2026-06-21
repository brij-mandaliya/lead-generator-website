import { Target, BarChart3, Megaphone, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarketingLayout from "@/components/layouts/MarketingLayout";

const services = [
  {
    icon: Target,
    title: "Lead Generation",
    tagline: "High-intent prospects, delivered daily",
    desc: "We source, verify, and deliver leads that are actively looking for what you sell. No scraped databases — curated signals from real buyer activity.",
    features: ["AI intent scoring", "Niche filtering (tech, budget, country)", "Daily automated delivery", "High-intent flagging"],
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    icon: BarChart3,
    title: "Market Research",
    tagline: "Know your niche before your competitors do",
    desc: "Deep-dive reports on market size, buyer behavior, tech stack trends, and competitive landscapes across your target verticals.",
    features: ["Vertical market analysis", "Buyer persona mapping", "Tech stack trends", "Competitive intelligence"],
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Lightbulb,
    title: "Business Strategy Consulting",
    tagline: "Turn data into a growth roadmap",
    desc: "One-on-one sessions with growth strategists who help you build a systematic client acquisition engine tailored to your service.",
    features: ["GTM strategy sessions", "ICP definition", "Offer positioning", "Pipeline design"],
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: Megaphone,
    title: "Outreach Automation",
    tagline: "Systems that prospect while you sleep",
    desc: "Done-for-you outreach templates, sequences, and automation playbooks that turn your lead list into a booked-call machine.",
    features: ["Cold email templates", "LinkedIn outreach scripts", "Follow-up sequences", "A/B testing frameworks"],
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export default function ServicesPage() {
  return (
    <MarketingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10">Services</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Everything You Need to Win Clients</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Four service pillars, one mission: put qualified buyers in front of your offer.
          </p>
        </div>

        <div className="space-y-8">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            const isEven = idx % 2 === 0;
            return (
              <div
                key={svc.title}
                className={`grid md:grid-cols-2 gap-8 items-center p-8 rounded-2xl border ${svc.border} ${svc.bg} bg-opacity-50`}
              >
                <div className={isEven ? "" : "md:order-2"}>
                  <div className={`w-12 h-12 rounded-xl ${svc.bg} border ${svc.border} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${svc.color}`} />
                  </div>
                  <div className={`text-xs font-semibold ${svc.color} mb-2 uppercase tracking-wider`}>{svc.tagline}</div>
                  <h2 className="text-2xl md:text-3xl font-black mb-4">{svc.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{svc.desc}</p>
                  <Link href="/register">
                    <Button variant="outline" className={`border ${svc.border} ${svc.color}`}>
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className={`${isEven ? "md:order-2" : ""} grid grid-cols-1 gap-3`}>
                  {svc.features.map((f) => (
                    <div key={f} className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-border/30">
                      <CheckCircle2 className={`w-4 h-4 ${svc.color} flex-shrink-0`} />
                      <span className="text-sm font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center p-12 rounded-2xl border border-primary/30 bg-primary/5">
          <h2 className="text-3xl font-black mb-4">Not Sure Which Service Fits?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Book a free strategy call and we'll map out the right growth system for your business.</p>
          <Link href="/contact">
            <Button size="lg" className="gradient-primary text-white border-0 h-12 px-8" data-testid="services-cta">
              Schedule a Call
            </Button>
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
