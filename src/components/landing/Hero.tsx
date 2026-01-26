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
            Transform deal documentation into structured, auditable underwriting evidence. 
            Ensure compliance with binder terms and risk appetite in real-time.
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
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-success" />
              <span>GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="animate-slide-up relative mx-auto mt-20 max-w-5xl" style={{ animationDelay: "0.3s" }}>
          <div className="glass-card-elevated overflow-hidden rounded-2xl border-primary/20">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <div className="ml-4 flex-1 rounded-md bg-background/50 px-4 py-1 text-xs text-muted-foreground">
                app.prebind.ai/dashboard
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-background via-card to-background p-6">
              {/* Grid Layout */}
              <div className="grid h-full gap-4 lg:grid-cols-3">
                {/* Left Panel */}
                <div className="space-y-4 lg:col-span-2">
                  <div className="glass-card h-16 animate-pulse rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-muted" />
                        <div className="h-2 w-48 rounded bg-muted/50" />
                      </div>
                    </div>
                  </div>
                  <div className="glass-card flex-1 rounded-xl p-4">
                    <div className="mb-4 h-3 w-24 rounded bg-muted" />
                    <div className="grid gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10" />
                          <div className="flex-1 space-y-2">
                            <div className="h-2 w-28 rounded bg-muted" />
                            <div className="h-2 w-40 rounded bg-muted/50" />
                          </div>
                          <div className="h-6 w-16 rounded-full bg-success/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right Panel */}
                <div className="space-y-4">
                  <div className="glass-card rounded-xl p-4">
                    <div className="mb-3 h-3 w-20 rounded bg-muted" />
                    <div className="flex items-end gap-2">
                      {[40, 65, 45, 80, 60, 75, 55].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-primary/40"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <div className="mb-3 h-3 w-24 rounded bg-muted" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-2 w-16 rounded bg-muted/50" />
                        <div className="h-2 w-8 rounded bg-success/50" />
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-primary to-cyan-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 top-1/4 animate-float glass-card rounded-xl border-success/30 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                    <FileCheck className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-foreground">Compliant</div>
                    <div className="text-xs text-muted-foreground">All checks passed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary/20 via-cyan-500/10 to-primary/20 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
