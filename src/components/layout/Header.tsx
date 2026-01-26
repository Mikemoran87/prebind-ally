import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import prebindLogo from "@/assets/prebind-logo.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={prebindLogo} alt="PreBind" className="h-20 w-auto" />
        </Link>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Link to="/dashboard">
            <Button variant="hero" size="sm">
              Dashboard
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
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Link to="/dashboard">
                <Button variant="hero" className="w-full">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
