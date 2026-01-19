import { Building2, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const useCases = [
  {
    icon: Building2,
    title: "Insurance Carriers",
    description: "Streamline your underwriting process with automated compliance checks and structured outputs that align with your risk appetite.",
    benefits: [
      "Automated binder term validation",
      "Real-time risk scoring",
      "Audit-ready documentation",
    ],
    gradient: "from-primary to-cyan-400",
  },
  {
    icon: Users,
    title: "Managing General Agents",
    description: "Enhance your delegated authority operations with transparent governance and complete audit trails for every transaction.",
    benefits: [
      "Delegated authority compliance",
      "Carrier alignment verification",
      "Performance analytics",
    ],
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: Shield,
    title: "Delegated Authorities",
    description: "Maintain full compliance with carrier guidelines while processing deals efficiently with AI-powered validation.",
    benefits: [
      "Authority limit tracking",
      "Automatic escalation rules",
      "Compliance reporting",
    ],
    gradient: "from-amber-500 to-orange-400",
  },
];

export function UseCases() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Purpose-Built for{" "}
            <span className="gradient-text">Your Role</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Whether you're a carrier, MGA, or delegated authority, PreBind adapts 
            to your specific governance requirements.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="group glass-card-elevated overflow-hidden transition-all duration-300 hover:border-primary/30"
            >
              {/* Gradient Header */}
              <div className={cn(
                "h-2 bg-gradient-to-r",
                useCase.gradient
              )} />
              
              <div className="p-8">
                <div className={cn(
                  "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br",
                  useCase.gradient
                )}>
                  <useCase.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                
                <h3 className="mb-3 font-display text-xl font-semibold text-foreground">
                  {useCase.title}
                </h3>
                
                <p className="mb-6 text-muted-foreground">
                  {useCase.description}
                </p>
                
                <ul className="space-y-3">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
