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
    action: "Report Finalised",
    description: "22 Bishopsgate, London EC2N 4BQ - Underwriting report marked as final",
    user: "Jane Doe",
    time: "5 min ago",
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: 2,
    action: "Risk Analysis Complete",
    description: "22 Bishopsgate, London EC2N 4BQ - All title risks reviewed and scored at 67%",
    user: "System",
    time: "15 min ago",
    icon: FileCheck,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: 3,
    action: "Compliance Check Passed",
    description: "22 Bishopsgate, London EC2N 4BQ - Binder terms validated, no breaches detected",
    user: "System",
    time: "20 min ago",
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: 4,
    action: "Document Analysed",
    description: "22 Bishopsgate, London EC2N 4BQ - Land Registry title deeds processed",
    user: "System",
    time: "25 min ago",
    icon: FileEdit,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-400/10",
  },
  {
    id: 5,
    action: "Review Assigned",
    description: "22 Bishopsgate, London EC2N 4BQ - Assigned to Title Underwriting team",
    user: "John Smith",
    time: "30 min ago",
    icon: UserCheck,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: 6,
    action: "Documents Uploaded",
    description: "22 Bishopsgate, London EC2N 4BQ - 3 attachments received from broker",
    user: "System",
    time: "35 min ago",
    icon: FileCheck,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    id: 7,
    action: "Deal Created",
    description: "22 Bishopsgate, London EC2N 4BQ - New enquiry from Howden Group",
    user: "joebloggs@howdengroup.com",
    time: "40 min ago",
    icon: FileEdit,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-400/10",
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
