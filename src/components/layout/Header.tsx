import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Platform", href: "/platform" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/resources" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-400">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            PreBind
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
              <ChevronDown className="h-3 w-3" />
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Link to="/dashboard">
            <Button variant="hero" size="sm">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto space-y-4 px-6 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-base font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Link to="/dashboard">
                <Button variant="hero" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
