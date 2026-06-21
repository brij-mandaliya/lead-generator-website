import { CheckCircle2, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useListPlans } from "@workspace/api-client-react";
import MarketingLayout from "@/components/layouts/MarketingLayout";
import { formatPrice } from "@/lib/utils";

const faqs = [
  { q: "How do you ensure the leads are accurate?", a: "We verify contact information through multiple sources and quality checks before delivery. Our goal is to provide reliable data that helps you connect with the right prospects." },
  { q: "Can you target leads based on my specific industry or niche?", a: "Yes. We build lead lists based on your target market, industry, location, company size, and other criteria to ensure relevance." },
  { q: "Do you provide contact details like email addresses and phone numbers?", a: "Yes. Depending on availability, we provide verified business emails, phone numbers, company information, and other relevant prospect details." },
  { q: "What makes your lead generation service different from buying a lead list?", a: "Unlike generic lead lists, our leads are researched and filtered according to your business goals, helping you focus on prospects that are more likely to be relevant." },
];

export default function PricingPage() {
  const { data: plans, isLoading } = useListPlans();

  const activePlans = plans?.filter((p) => p.isActive) || [];

  return (
    <MarketingLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 text-primary border-primary/30 bg-primary/10">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Invest in Your Pipeline</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Simple pricing, real results. No hidden fees, no long-term lock-in.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
          </div>
        ) : activePlans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {activePlans.map((plan, idx) => {
              const isPopular = idx === 1;
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-xl border ${
                    isPopular ? "border-primary/50 bg-primary/5 glow-primary" : "border-border/50 bg-card"
                  }`}
                  data-testid={`plan-card-${plan.id}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <div className="gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Most Popular
                      </div>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-black">{formatPrice(plan.price, plan.currency)}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{plan.leadsPerDay} opportunities per day</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {(plan.features || []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/register">
                    <Button
                      className={`w-full ${isPopular ? "gradient-primary text-white border-0 glow-sm" : ""}`}
                      variant={isPopular ? "default" : "outline"}
                      data-testid={`plan-cta-${plan.id}`}
                    >
                      Get {plan.name}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-20">
            <p>Plans loading... <Link href="/register"><span className="text-primary hover:underline cursor-pointer">Sign up</span></Link> to see current plans.</p>
          </div>
        )}

        {/* ROI Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            { label: "Average client value", value: "₹2,50,000/mo" },
            { label: "Avg leads to close ratio", value: "1 in 12" },
            { label: "ROI on Growth plan", value: "850%" },
          ].map((item) => (
            <div key={item.label} className="text-center p-6 rounded-xl border border-border/50 bg-card">
              <div className="text-3xl font-black gradient-text mb-2">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 rounded-xl border border-border/50 bg-card">
                <div className="font-semibold text-sm mb-2">{faq.q}</div>
                <div className="text-sm text-muted-foreground">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
