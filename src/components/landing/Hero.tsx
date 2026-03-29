import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Shield, FileCheck, Brain } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container relative mx-auto px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Brain className="h-4 w-4" />
            <span>AI-Powered Underwriting Governance</span>
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Pre-Bind Governance{" "}
            <span className="gradient-text">Reimagined</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: "0.1s" }}>
            PreBind takes unstructured deal information — emails, PDFs, data dumps — and structures it into underwriting outputs. Identify risk, build rationale, and leave a clear defensive decision trail. Built for Lloyd's underwriters.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: "0.2s" }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="mailto:sales@prebind.ai">
              <Button variant="glass" size="xl" className="group">
                <Mail className="h-5 w-5" />
                Contact Us
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="animate-fade-in mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span>Lloyd's Market Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-success" />
              <span>Blueprint Two Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-success" />
              <span>GPT-4o Powered Analysis</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
