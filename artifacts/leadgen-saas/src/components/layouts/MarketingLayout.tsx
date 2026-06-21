import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProspectHiveLogo } from "@/components/ui/ProspectHiveLogo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <ProspectHiveLogo size={32} />
                <span className="font-bold text-lg text-foreground">ProspectHive</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`text-sm font-medium transition-colors cursor-pointer ${
                      location === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button size="sm" className="gradient-primary text-white border-0">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" data-testid="nav-login">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="gradient-primary text-white border-0" data-testid="nav-register">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                className="text-muted-foreground p-1"
                onClick={() => setMenuOpen(!menuOpen)}
                data-testid="nav-mobile-menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 cursor-pointer" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  <Button className="w-full gradient-primary text-white border-0">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" className="w-full">Sign in</Button></Link>
                  <Link href="/register"><Button className="w-full gradient-primary text-white border-0">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ProspectHiveLogo size={28} />
                <span className="font-bold text-foreground">ProspectHive</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">High-intent leads for agencies and SaaS founders who mean business.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Links</h4>
              <div className="space-y-2">
                {[
                  { label: "Services", href: "/services" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{item.label}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2">
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <div key={item} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{item}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">© 2026 ProspectHive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
