import { useState } from "react";
import { FileText, MoreVertical, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DealCategory = "title" | "wni" | "contingent" | "tax" | "environmental";

interface Deal {
  id: string;
  name: string;
  carrier: string;
  status: "compliant" | "review" | "flagged";
  riskScore: number;
  date: string;
}

const dealsByCategory: Record<DealCategory, Deal[]> = {
  title: [
    {
      id: "TI-2024-001",
      name: "Commercial Real Estate Title",
      carrier: "First American",
      status: "compliant",
      riskScore: 92,
      date: "2 hours ago",
    },
    {
      id: "TI-2024-002",
      name: "Residential Portfolio Title",
      carrier: "Old Republic",
      status: "compliant",
      riskScore: 88,
      date: "4 hours ago",
    },
    {
      id: "TI-2024-003",
      name: "Industrial Property Title",
      carrier: "Stewart Title",
      status: "review",
      riskScore: 71,
      date: "6 hours ago",
    },
    {
      id: "TI-2024-004",
      name: "Mixed-Use Development Title",
      carrier: "Fidelity National",
      status: "flagged",
      riskScore: 45,
      date: "8 hours ago",
    },
    {
      id: "TI-2024-005",
      name: "Agricultural Land Title",
      carrier: "Chicago Title",
      status: "compliant",
      riskScore: 85,
      date: "12 hours ago",
    },
  ],
  wni: [
    {
      id: "WI-2024-001",
      name: "M&A Warranty Coverage",
      carrier: "AIG",
      status: "compliant",
      riskScore: 82,
      date: "1 hour ago",
    },
    {
      id: "WI-2024-002",
      name: "Private Equity W&I Policy",
      carrier: "Euclid Transactional",
      status: "review",
      riskScore: 68,
      date: "3 hours ago",
    },
    {
      id: "WI-2024-003",
      name: "Cross-Border Acquisition W&I",
      carrier: "Liberty GTS",
      status: "compliant",
      riskScore: 91,
      date: "5 hours ago",
    },
    {
      id: "WI-2024-004",
      name: "Tech Startup M&A Coverage",
      carrier: "AWAC",
      status: "flagged",
      riskScore: 42,
      date: "7 hours ago",
    },
    {
      id: "WI-2024-005",
      name: "Healthcare M&A Indemnity",
      carrier: "Tokio Marine HCC",
      status: "compliant",
      riskScore: 87,
      date: "10 hours ago",
    },
  ],
  contingent: [
    {
      id: "CR-2024-001",
      name: "Litigation Buyout Coverage",
      carrier: "Mosaic Insurance",
      status: "review",
      riskScore: 65,
      date: "30 minutes ago",
    },
    {
      id: "CR-2024-002",
      name: "IP Dispute Protection",
      carrier: "Berkshire Hathaway",
      status: "compliant",
      riskScore: 84,
      date: "2 hours ago",
    },
    {
      id: "CR-2024-003",
      name: "Regulatory Risk Coverage",
      carrier: "Swiss Re",
      status: "flagged",
      riskScore: 38,
      date: "4 hours ago",
    },
    {
      id: "CR-2024-004",
      name: "Contract Dispute Insurance",
      carrier: "Aspen Insurance",
      status: "compliant",
      riskScore: 79,
      date: "6 hours ago",
    },
    {
      id: "CR-2024-005",
      name: "Successor Liability Policy",
      carrier: "Ambridge Partners",
      status: "review",
      riskScore: 72,
      date: "9 hours ago",
    },
  ],
  tax: [
    {
      id: "TX-2024-001",
      name: "Tax Opinion Insurance",
      carrier: "CNA Financial",
      status: "compliant",
      riskScore: 89,
      date: "1 hour ago",
    },
    {
      id: "TX-2024-002",
      name: "Transfer Pricing Coverage",
      carrier: "Zurich Insurance",
      status: "review",
      riskScore: 63,
      date: "3 hours ago",
    },
    {
      id: "TX-2024-003",
      name: "Section 338(h)(10) Election",
      carrier: "Ryan Specialty",
      status: "compliant",
      riskScore: 94,
      date: "5 hours ago",
    },
    {
      id: "TX-2024-004",
      name: "REIT Qualification Risk",
      carrier: "Aon",
      status: "flagged",
      riskScore: 41,
      date: "8 hours ago",
    },
    {
      id: "TX-2024-005",
      name: "Net Operating Loss Coverage",
      carrier: "Marsh McLennan",
      status: "compliant",
      riskScore: 86,
      date: "11 hours ago",
    },
  ],
  environmental: [
    {
      id: "EV-2024-001",
      name: "Brownfield Site Coverage",
      carrier: "Chubb Environmental",
      status: "review",
      riskScore: 58,
      date: "45 minutes ago",
    },
    {
      id: "EV-2024-002",
      name: "Pollution Liability Policy",
      carrier: "AXA XL",
      status: "compliant",
      riskScore: 81,
      date: "2 hours ago",
    },
    {
      id: "EV-2024-003",
      name: "Remediation Cost Cap",
      carrier: "Beazley Environmental",
      status: "flagged",
      riskScore: 35,
      date: "4 hours ago",
    },
    {
      id: "EV-2024-004",
      name: "Site Pollution Coverage",
      carrier: "Great American",
      status: "compliant",
      riskScore: 77,
      date: "7 hours ago",
    },
    {
      id: "EV-2024-005",
      name: "Environmental Impairment",
      carrier: "Intact Insurance",
      status: "compliant",
      riskScore: 83,
      date: "10 hours ago",
    },
  ],
};

const tabs = [
  { id: "title" as DealCategory, label: "Title" },
  { id: "wni" as DealCategory, label: "W&I" },
  { id: "contingent" as DealCategory, label: "Contingent Risk" },
  { id: "tax" as DealCategory, label: "Tax" },
  { id: "environmental" as DealCategory, label: "Environmental" },
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
  const [activeTab, setActiveTab] = useState<DealCategory>("title");

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DealCategory)} className="mt-4">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="divide-y divide-border">
        {dealsByCategory[activeTab].map((deal) => (
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
                  statusConfig[deal.status].className
                )}
              >
                {statusConfig[deal.status].label}
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
