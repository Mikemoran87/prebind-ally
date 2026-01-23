import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Total Deals",
    value: "5",
    change: "+12%",
    changeType: "positive",
    icon: FileText,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    title: "Compliant",
    value: "1,089",
    change: "+8%",
    changeType: "positive",
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    title: "Flagged",
    value: "42",
    change: "-15%",
    changeType: "positive",
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
  {
    title: "Pending Review",
    value: "116",
    change: "+3%",
    changeType: "neutral",
    icon: Clock,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="glass-card p-6 transition-all duration-300 hover:border-primary/30"
        >
          <div className="flex items-center justify-between">
            <div className={cn("rounded-xl p-3", stat.iconBg)}>
              <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
            </div>
            <span
              className={cn(
                "text-sm font-medium",
                stat.changeType === "positive"
                  ? "text-success"
                  : stat.changeType === "negative"
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stat.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
