import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Leaf, 
  Scale, 
  Banknote,
  Clock,
  User,
  FileCheck,
  AlertCircle
} from "lucide-react";

const productLines = [
  { id: "title", label: "Title", icon: FileText },
  { id: "w_and_i", label: "W&I", icon: Shield },
  { id: "contingent_risk", label: "Contingent Risk", icon: Scale },
  { id: "tax", label: "Tax", icon: Banknote },
  { id: "environmental", label: "Environmental", icon: Leaf },
];

interface AuditRecord {
  id: string;
  timestamp: string;
  dealName: string;
  dealId: string;
  riskIdentified: string;
  riskSeverity: "low" | "medium" | "high" | "critical";
  assessment: string;
  complianceReason: string;
  decision: "approved" | "declined" | "pending";
  underwriter: string;
  category: string;
}

const auditData: Record<string, AuditRecord[]> = {
  title: [
    {
      id: "1",
      timestamp: "2026-01-23T14:32:00Z",
      dealName: "Acme Corp Title Insurance",
      dealId: "DEAL-2026-001",
      riskIdentified: "Chain of Title Gap (1987-1992)",
      riskSeverity: "medium",
      assessment: "Historical gap in ownership records identified during 30-year title search. Gap period covers estate transfer with incomplete probate documentation.",
      complianceReason: "Risk mitigated through enhanced due diligence: obtained affidavit from heir, verified tax payment continuity, and confirmed no adverse claims filed. Within acceptable risk appetite per Policy 4.2.1.",
      decision: "approved",
      underwriter: "Jane Doe",
      category: "title",
    },
    {
      id: "2",
      timestamp: "2026-01-23T11:15:00Z",
      dealName: "Summit Properties Title",
      dealId: "DEAL-2026-002",
      riskIdentified: "Existing Mechanic's Lien",
      riskSeverity: "high",
      assessment: "Active mechanic's lien of $45,000 filed by contractor for unpaid renovation work. Lien recorded 6 months prior to application.",
      complianceReason: "Lien resolution required as condition precedent. Seller agreed to escrow 150% of lien amount pending resolution. Compliant with Pre-Bind Checklist Item 3.4.",
      decision: "approved",
      underwriter: "John Smith",
      category: "title",
    },
    {
      id: "3",
      timestamp: "2026-01-22T16:45:00Z",
      dealName: "Riverside Commercial Title",
      dealId: "DEAL-2026-003",
      riskIdentified: "Boundary Encroachment",
      riskSeverity: "critical",
      assessment: "Survey reveals neighboring structure encroaches 8 feet onto subject property. No recorded easement. Encroachment affects 12% of property footprint.",
      complianceReason: "Declined per Risk Appetite Statement Section 2.1: Material encroachments exceeding 5% of property area without recorded easement are outside binding authority.",
      decision: "declined",
      underwriter: "Jane Doe",
      category: "title",
    },
    {
      id: "4",
      timestamp: "2026-01-22T09:20:00Z",
      dealName: "Harbor View Residential",
      dealId: "DEAL-2026-004",
      riskIdentified: "Pending Zoning Change",
      riskSeverity: "low",
      assessment: "Municipal notice of proposed rezoning from residential to mixed-use. Change would not affect current use or value.",
      complianceReason: "Informational disclosure added to policy. No material impact on insured interest. Compliant with disclosure requirements per Binder Terms 5.2.",
      decision: "approved",
      underwriter: "Sarah Chen",
      category: "title",
    },
  ],
  w_and_i: [
    {
      id: "5",
      timestamp: "2026-01-23T13:00:00Z",
      dealName: "TechStart Acquisition W&I",
      dealId: "DEAL-2026-005",
      riskIdentified: "Incomplete IP Assignment Records",
      riskSeverity: "medium",
      assessment: "Two software patents lack clear assignment documentation from founding developers to company.",
      complianceReason: "Seller obtained retroactive assignment agreements. Representations updated to warrant clear IP chain. Within coverage limits and compliant with Underwriting Guidelines 6.3.",
      decision: "approved",
      underwriter: "Michael Park",
      category: "w_and_i",
    },
    {
      id: "6",
      timestamp: "2026-01-21T10:30:00Z",
      dealName: "GlobalMerge W&I Policy",
      dealId: "DEAL-2026-006",
      riskIdentified: "Undisclosed Related Party Transactions",
      riskSeverity: "high",
      assessment: "Due diligence revealed $2.3M in transactions with entity controlled by target CFO. Not disclosed in initial data room.",
      complianceReason: "Material non-disclosure creates adverse selection risk. Declined per Policy Exception Matrix - undisclosed related party transactions over $500K require automatic referral and were denied by senior committee.",
      decision: "declined",
      underwriter: "Jane Doe",
      category: "w_and_i",
    },
  ],
  contingent_risk: [
    {
      id: "7",
      timestamp: "2026-01-23T15:45:00Z",
      dealName: "Pending Litigation Coverage",
      dealId: "DEAL-2026-007",
      riskIdentified: "Adverse Court Ruling Probability",
      riskSeverity: "medium",
      assessment: "Patent infringement suit with 60% probability of adverse ruling based on legal counsel assessment. Maximum exposure: $4.2M.",
      complianceReason: "Premium priced at 2.8% of limit reflecting elevated risk. Retention set at $500K per Contingent Risk Pricing Model v3.2. Compliant with aggregate exposure limits.",
      decision: "approved",
      underwriter: "Robert Kim",
      category: "contingent_risk",
    },
  ],
  tax: [
    {
      id: "8",
      timestamp: "2026-01-22T14:00:00Z",
      dealName: "Cross-Border Tax Opinion",
      dealId: "DEAL-2026-008",
      riskIdentified: "Transfer Pricing Challenge Risk",
      riskSeverity: "medium",
      assessment: "Intercompany pricing methodology may be challenged by tax authority. Big 4 opinion obtained but rated as 'more likely than not' rather than 'should' standard.",
      complianceReason: "Coverage bound with specific exclusion for penalties and interest. Base tax exposure within appetite. Opinion quality disclosed to insured. Compliant with Tax Product Guidelines Section 4.1.",
      decision: "approved",
      underwriter: "Lisa Wang",
      category: "tax",
    },
  ],
  environmental: [
    {
      id: "9",
      timestamp: "2026-01-21T11:00:00Z",
      dealName: "Industrial Site Remediation",
      dealId: "DEAL-2026-009",
      riskIdentified: "Historical Contamination - PCBs",
      riskSeverity: "high",
      assessment: "Phase II ESA confirms PCB contamination in soil at levels requiring remediation. Estimated cleanup cost: $1.8M - $2.4M.",
      complianceReason: "Cost cap policy issued with $3M limit above known remediation estimate. Baseline contamination excluded per standard terms. Premium reflects elevated uncertainty. Compliant with Environmental Underwriting Manual Ch. 7.",
      decision: "approved",
      underwriter: "David Torres",
      category: "environmental",
    },
  ],
};

const severityColors: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
};

const decisionColors: Record<string, string> = {
  approved: "bg-success/10 text-success border-success/20",
  declined: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

const decisionIcons: Record<string, typeof CheckCircle> = {
  approved: CheckCircle,
  declined: AlertCircle,
  pending: Clock,
};

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AuditTrail() {
  const [activeTab, setActiveTab] = useState("title");

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <DashboardHeader 
          title="Audit Trail" 
          subtitle="Pre-bind underwriting records with full compliance documentation" 
        />
        <main className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              {productLines.map((line) => {
                const records = auditData[line.id] || [];
                return (
                  <TabsTrigger
                    key={line.id}
                    value={line.id}
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <line.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{line.label}</span>
                    <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                      {records.length}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {productLines.map((line) => {
              const records = auditData[line.id] || [];

              return (
                <TabsContent key={line.id} value={line.id}>
                  <div className="space-y-4">
                    {records.length === 0 ? (
                      <Card className="glass-card">
                        <CardContent className="p-6 text-center text-muted-foreground">
                          No audit records for this product line
                        </CardContent>
                      </Card>
                    ) : (
                      records.map((record) => {
                        const DecisionIcon = decisionIcons[record.decision];
                        return (
                          <Card
                            key={record.id}
                            className="glass-card transition-all duration-200 hover:border-primary/30"
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <CardTitle className="text-lg font-semibold">
                                      {record.dealName}
                                    </CardTitle>
                                    <Badge variant="outline" className="text-xs">
                                      {record.dealId}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      {formatTimestamp(record.timestamp)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <User className="h-3.5 w-3.5" />
                                      {record.underwriter}
                                    </span>
                                  </div>
                                </div>
                                <Badge className={decisionColors[record.decision]}>
                                  <DecisionIcon className="h-3 w-3 mr-1" />
                                  {record.decision.charAt(0).toUpperCase() + record.decision.slice(1)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Risk Identified */}
                              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="h-4 w-4 text-warning" />
                                  <span className="text-sm font-medium text-foreground">
                                    Risk Identified
                                  </span>
                                  <Badge className={severityColors[record.riskSeverity]}>
                                    {record.riskSeverity.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground font-medium">
                                  {record.riskIdentified}
                                </p>
                              </div>

                              {/* Assessment */}
                              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-medium text-foreground">
                                    Assessment
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {record.assessment}
                                </p>
                              </div>

                              {/* Compliance Decision */}
                              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileCheck className="h-4 w-4 text-success" />
                                  <span className="text-sm font-medium text-foreground">
                                    Compliance Rationale
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {record.complianceReason}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </main>
      </div>
    </div>
  );
}
