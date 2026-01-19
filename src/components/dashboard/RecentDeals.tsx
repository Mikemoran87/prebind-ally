import { FileText, MoreVertical, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const deals = [
  {
    id: "DEAL-2024-001",
    name: "Commercial Property Portfolio",
    carrier: "Axis Insurance",
    status: "compliant",
    riskScore: 82,
    date: "2 hours ago",
  },
  {
    id: "DEAL-2024-002",
    name: "D&O Coverage Extension",
    carrier: "Beazley Group",
    status: "review",
    riskScore: 65,
    date: "4 hours ago",
  },
  {
    id: "DEAL-2024-003",
    name: "Cyber Liability Renewal",
    carrier: "Liberty Mutual",
    status: "compliant",
    riskScore: 91,
    date: "6 hours ago",
  },
  {
    id: "DEAL-2024-004",
    name: "Marine Cargo Coverage",
    carrier: "Munich Re",
    status: "flagged",
    riskScore: 45,
    date: "8 hours ago",
  },
  {
    id: "DEAL-2024-005",
    name: "Professional Indemnity",
    carrier: "Hiscox",
    status: "compliant",
    riskScore: 88,
    date: "12 hours ago",
  },
];

const statusConfig = {
  compliant: {
    label: "Compliant",
    className: "status-compliant",
  },
  review: {
    label: "In Review",
    className: "status-review",
  },
  flagged: {
    label: "Flagged",
    className: "status-flagged",
  },
};

export function RecentDeals() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">
            Recent Deals
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest processed deal documentation
          </p>
        </div>
        <Button variant="ghost" size="sm">
          View All
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="divide-y divide-border">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{deal.name}</span>
                <span className="text-xs text-muted-foreground">
                  {deal.id}
                </span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {deal.carrier} · {deal.date}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Risk Score */}
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Risk Score</div>
                <div
                  className={cn(
                    "font-display text-lg font-semibold",
                    deal.riskScore >= 80
                      ? "text-success"
                      : deal.riskScore >= 60
                      ? "text-warning"
                      : "text-destructive"
                  )}
                >
                  {deal.riskScore}
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  statusConfig[deal.status as keyof typeof statusConfig].className
                )}
              >
                {statusConfig[deal.status as keyof typeof statusConfig].label}
              </span>

              {/* Actions */}
              <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
