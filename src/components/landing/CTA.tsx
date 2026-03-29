import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-10" />
      
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Ready to Transform Your{" "}
            <span className="gradient-text">Underwriting Governance</span>?
          </h2>
          
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Built for Lloyd's underwriters who need to stop gathering evidence and start exercising judgment — at scale, with confidence.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="mailto:hello@prebind.ai">
              <Button variant="hero" size="xl" className="group">
                Request a Demo
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <Link to="/login">
              <Button variant="glass" size="xl">
                Sign In
              </Button>
            </Link>
        </div>
        </div>
      </div>
    </section>
  );
}
