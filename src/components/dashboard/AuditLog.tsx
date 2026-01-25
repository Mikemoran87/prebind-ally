import { 
  FileCheck, 
  AlertTriangle, 
  UserCheck, 
  FileEdit,
  CheckCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const auditItems = [
  {
    id: 1,
    action: "Document Approved",
    description: "22 Bishopsgate, London EC2N 4BQ title risk approved by Senior Underwriter",
    user: "Jane Doe",
    time: "5 min ago",
    icon: FileCheck,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: 2,
    action: "Compliance Alert",
    description: "Marine Cargo Coverage flagged for limit breach",
    user: "System",
    time: "15 min ago",
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
  {
    id: 3,
    action: "Review Assigned",
    description: "D&O Coverage Extension assigned to compliance team",
    user: "John Smith",
    time: "1 hour ago",
    icon: UserCheck,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: 4,
    action: "Document Modified",
    description: "Professional Indemnity terms updated",
    user: "Sarah Wilson",
    time: "2 hours ago",
    icon: FileEdit,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-400/10",
  },
  {
    id: 5,
    action: "Compliance Verified",
    description: "Cyber Liability Renewal passed all validation checks",
    user: "System",
    time: "3 hours ago",
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
];

export function AuditLog() {
  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Audit Trail
        </h3>
        <p className="text-sm text-muted-foreground">
          Recent activity and changes
        </p>
      </div>

      <div className="relative space-y-0">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-px bg-border" />

        {auditItems.map((item, index) => (
          <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border",
                item.iconBg
              )}
            >
              <item.icon className={cn("h-4 w-4", item.iconColor)} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.action}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                by {item.user}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
