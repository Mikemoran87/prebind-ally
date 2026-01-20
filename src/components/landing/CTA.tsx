import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

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
            Join leading carriers and MGAs who trust PreBind to automate 
            their pre-bind compliance and risk assessment workflows.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="glass" size="xl">
              <Calendar className="h-5 w-5" />
              Schedule Demo
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
