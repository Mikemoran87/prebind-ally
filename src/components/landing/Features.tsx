import { 
  FileSearch, 
  ShieldCheck, 
  BarChart3, 
  History, 
  Zap, 
  Lock,
  Brain,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FileSearch,
    title: "Intelligent Data Extraction",
    description: "Advanced NLP extracts and structures data from any deal document format, mapping to underwriting standards automatically.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Compliance",
    description: "Continuous validation against binder terms and risk appetite criteria with instant flagging of non-conformities.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Brain,
    title: "ML Risk Assessment",
    description: "Machine learning models analyze historical patterns to assess risk and predict potential compliance issues.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: History,
    title: "Complete Audit Trail",
    description: "Comprehensive logging of all transactions, changes, and approvals with full version control and traceability.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Forecast compliance issues before they occur using historical underwriting data and advanced analytics.",
    color: "text-violet-400",
    bgColor: "bg-violet-400/10",
  },
  {
    icon: Zap,
    title: "Seamless Integration",
    description: "API-first architecture enables easy integration with existing insurance management systems and third-party tools.",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant with end-to-end encryption, role-based access controls, and comprehensive data protection.",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
  },
  {
    icon: MessageSquare,
    title: "Chat to Binder",
    description: "Chatbot that allows you to check any query directly against the binder in real time.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
];

export function Features() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container relative mx-auto px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="gradient-text">Modern Underwriting</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every feature designed to streamline your pre-bind governance workflow
            while maintaining the highest compliance standards.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group glass-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                index === 0 && "sm:col-span-2 lg:col-span-1"
              )}
            >
              <div className={cn(
                "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                feature.bgColor
              )}>
                <feature.icon className={cn("h-6 w-6", feature.color)} />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
