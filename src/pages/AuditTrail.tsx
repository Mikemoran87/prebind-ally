import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  AlertCircle,
  FileSearch,
  Link2,
  PenTool,
  Zap,
  BookOpen
} from "lucide-react";
const productLines = [
  { id: "title", label: "Title", icon: FileText },
  { id: "w_and_i", label: "W&I", icon: Shield },
  { id: "contingent_risk", label: "Contingent Risk", icon: Scale },
  { id: "tax", label: "Tax", icon: Banknote },
  { id: "environmental", label: "Environmental", icon: Leaf },
];

interface DocumentReviewed {
  name: string;
  type: string;
  dateReviewed: string;
  status?: "clean" | "compliant" | "flagged" | "pending";
}

interface RiskIdentified {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  sourceDocument: string;
  pageReference: string;
  description: string;
}

interface BinderAlignment {
  clause: string;
  status: "compliant" | "exception" | "excluded";
  notes: string;
}

interface UnderwriterSignOff {
  name: string;
  title: string;
  timestamp: string;
  decision: "approved" | "declined" | "pending";
  comments: string;
}

interface AuditRecord {
  id: string;
  timestamp: string;
  dealName: string;
  dealId: string;
  documentsReviewed: DocumentReviewed[];
  risksIdentified: RiskIdentified[];
  binderAlignment: BinderAlignment[];
  underwriterSignOff: UnderwriterSignOff;
  result: {
    auditTime: string;
    findingsCount: number;
    remediationRisk: "low" | "medium" | "high";
  };
}

const auditData: Record<string, AuditRecord> = {
  title: {
    id: "1",
    timestamp: "2026-01-25T21:18:00Z",
    dealName: "Commercial Real Estate Acquisition - 22 Bishopsgate, London EC2N 4BQ",
    dealId: "TI-2026-6245",
    documentsReviewed: [
      { name: "Legal Due Diligence Report - Squire Patton Boggs.pdf", type: "Legal Opinion", dateReviewed: "2026-01-26", status: "clean" },
      { name: "RICS Building Survey Report.pdf", type: "Survey", dateReviewed: "2026-01-26", status: "compliant" },
      { name: "Statutory Declaration re: Long Use of Services - Executed.pdf", type: "Statutory Declaration", dateReviewed: "2026-01-26", status: "flagged" },
      { name: "Planning Permission - City of London.pdf", type: "Planning", dateReviewed: "2026-01-26", status: "compliant" },
      { name: "Statutory Declaration re: Long Use of Possessory Plot - Executed.pdf", type: "Statutory Declaration", dateReviewed: "2026-01-26", status: "compliant" },
    ],
    risksIdentified: [
      {
        title: "Absence of Easement Risk",
        severity: "low",
        sourceDocument: "Statutory Declaration re: Long Use of Services - Executed.pdf",
        pageReference: "Pages 1-3",
        description: "Statutory declaration provided showing long historic use of services for the property."
      },
      {
        title: "Utility Easement - Eastern Boundary",
        severity: "low",
        sourceDocument: "Easement Schedule",
        pageReference: "Schedule 2, Para 4",
        description: "Recorded utility and pedestrian access rights along eastern boundary - standard terms, no impact on value."
      },
      {
        title: "Section 106 Planning Obligations",
        severity: "low",
        sourceDocument: "Section 106 Agreement",
        pageReference: "Clause 7.2",
        description: "Ongoing obligations for public realm contributions - fully disclosed and costed by buyer's advisers."
      }
    ],
    binderAlignment: [
      { clause: "Coverage - Title to Real Estate, All Unknown Risk Coverage", status: "compliant", notes: "Within delegated authority coverage by carrier" },
      { clause: "Coverage Limit: £245,000,000", status: "compliant", notes: "Within delegated authority limit by carrier" },
      { clause: "Insured Jurisdiction - UK", status: "compliant", notes: "Within delegated jurisdiction" },
      { clause: "Transaction PML", status: "compliant", notes: "£750,000" },
      { clause: "Standard Policy Exclusions Applied", status: "compliant", notes: "Contained in policy schedule" },
      { clause: "Underwriter - Jane Doe", status: "compliant", notes: "Within underwriter's delegated authority limit" },
    ],
    underwriterSignOff: {
      name: "Jane Doe",
      title: "Senior Title Underwriter",
      timestamp: "2026-01-25T21:18:00Z",
      decision: "approved",
      comments: "Crown Estate landlord consent verified. All easements disclosed and standard. Section 106 obligations fully costed. Risk score 67% within appetite. Recommend binding at standard premium with requested endorsements."
    },
    result: {
      auditTime: "2.8 hours",
      findingsCount: 0,
      remediationRisk: "low"
    }
  },
  w_and_i: {
    id: "2",
    timestamp: "2026-01-23T13:00:00Z",
    dealName: "TechStart Acquisition W&I",
    dealId: "DEAL-2026-005",
    documentsReviewed: [
      { name: "Stock Purchase Agreement", type: "Transaction Doc", dateReviewed: "2026-01-20" },
      { name: "Disclosure Schedules", type: "Transaction Doc", dateReviewed: "2026-01-21" },
      { name: "Financial Statements (3 years)", type: "Financial", dateReviewed: "2026-01-21" },
      { name: "IP Assignment Schedule", type: "IP Documentation", dateReviewed: "2026-01-22" },
      { name: "Employee Agreements Summary", type: "HR Documentation", dateReviewed: "2026-01-22" },
      { name: "Vendor Due Diligence Report", type: "Due Diligence", dateReviewed: "2026-01-23" },
    ],
    risksIdentified: [
      {
        title: "Incomplete IP Assignment Records",
        severity: "medium",
        sourceDocument: "IP Assignment Schedule",
        pageReference: "Section 3.2, Items 4-5",
        description: "Two software patents lack clear assignment documentation from founding developers to company."
      },
      {
        title: "Customer Concentration Risk",
        severity: "low",
        sourceDocument: "Financial Statements",
        pageReference: "Revenue Note, Page 34",
        description: "Top 3 customers represent 45% of revenue - disclosed and priced accordingly."
      }
    ],
    binderAlignment: [
      { clause: "Policy Limit: $15,000,000", status: "compliant", notes: "10% of enterprise value per guidelines" },
      { clause: "Retention: $750,000", status: "compliant", notes: "1% tipping to nil structure approved" },
      { clause: "IP Representations Coverage", status: "compliant", notes: "Retroactive assignments obtained" },
      { clause: "Tax Indemnity Exclusion", status: "excluded", notes: "Separate tax policy recommended" },
    ],
    underwriterSignOff: {
      name: "Michael Park",
      title: "VP, Transactional Risk",
      timestamp: "2026-01-23T13:00:00Z",
      decision: "approved",
      comments: "Seller obtained retroactive assignment agreements satisfying IP warranty requirements. Deal priced at 2.1% reflecting customer concentration. Recommend bind."
    },
    result: {
      auditTime: "4.2 hours",
      findingsCount: 0,
      remediationRisk: "low"
    }
  },
  contingent_risk: {
    id: "3",
    timestamp: "2026-01-23T15:45:00Z",
    dealName: "Pending Patent Litigation Coverage",
    dealId: "DEAL-2026-007",
    documentsReviewed: [
      { name: "Complaint Filing", type: "Legal Pleading", dateReviewed: "2026-01-20" },
      { name: "Defense Counsel Memo", type: "Legal Opinion", dateReviewed: "2026-01-21" },
      { name: "Patent Claims Analysis", type: "Technical Review", dateReviewed: "2026-01-22" },
      { name: "Damages Expert Report", type: "Expert Opinion", dateReviewed: "2026-01-22" },
      { name: "Settlement Probability Assessment", type: "Actuarial", dateReviewed: "2026-01-23" },
    ],
    risksIdentified: [
      {
        title: "Adverse Court Ruling Probability",
        severity: "medium",
        sourceDocument: "Defense Counsel Memo",
        pageReference: "Section 5: Risk Assessment",
        description: "60% probability of adverse ruling based on claim construction analysis and venue history."
      },
      {
        title: "Damages Exposure Range",
        severity: "medium",
        sourceDocument: "Damages Expert Report",
        pageReference: "Exhibit A, Page 8",
        description: "Maximum exposure assessed at $4.2M based on reasonable royalty methodology."
      }
    ],
    binderAlignment: [
      { clause: "Policy Limit: $5,000,000", status: "compliant", notes: "Covers maximum assessed exposure with buffer" },
      { clause: "Retention: $500,000", status: "compliant", notes: "Per Contingent Risk Pricing Model v3.2" },
      { clause: "Premium Rate: 2.8%", status: "compliant", notes: "Reflects 60% adverse probability" },
      { clause: "Defense Cost Coverage", status: "exception", notes: "Excluded - insured retaining own counsel" },
    ],
    underwriterSignOff: {
      name: "Robert Kim",
      title: "Contingent Risk Specialist",
      timestamp: "2026-01-23T15:45:00Z",
      decision: "approved",
      comments: "Pricing reflects elevated probability of loss. Retention appropriate for deal size. Aggregate exposure within portfolio limits. Approved for binding."
    },
    result: {
      auditTime: "3.8 hours",
      findingsCount: 1,
      remediationRisk: "low"
    }
  },
  tax: {
    id: "4",
    timestamp: "2026-01-22T14:00:00Z",
    dealName: "Cross-Border Tax Opinion Coverage",
    dealId: "DEAL-2026-008",
    documentsReviewed: [
      { name: "Tax Opinion Letter", type: "Legal Opinion", dateReviewed: "2026-01-19" },
      { name: "Transfer Pricing Study", type: "Economic Analysis", dateReviewed: "2026-01-20" },
      { name: "Intercompany Agreements", type: "Transaction Doc", dateReviewed: "2026-01-20" },
      { name: "Jurisdictional Tax Analysis", type: "Tax Memo", dateReviewed: "2026-01-21" },
      { name: "Historical Audit Results", type: "Tax Records", dateReviewed: "2026-01-21" },
    ],
    risksIdentified: [
      {
        title: "Transfer Pricing Challenge Risk",
        severity: "medium",
        sourceDocument: "Tax Opinion Letter",
        pageReference: "Conclusion, Para 4.2",
        description: "Opinion rated 'more likely than not' rather than 'should' standard - elevated uncertainty."
      },
      {
        title: "Jurisdictional Audit Trigger",
        severity: "low",
        sourceDocument: "Historical Audit Results",
        pageReference: "Exhibit B",
        description: "Prior audit cycle ended without adjustment - favorable indicator for current structure."
      }
    ],
    binderAlignment: [
      { clause: "Coverage Limit: $8,000,000", status: "compliant", notes: "Covers base tax exposure at 1.5x" },
      { clause: "Penalties & Interest Exclusion", status: "excluded", notes: "Standard exclusion applied" },
      { clause: "Opinion Quality Disclosure", status: "compliant", notes: "MLTN standard disclosed to insured" },
      { clause: "Audit Defense Coverage", status: "compliant", notes: "Included up to $500K sublimit" },
    ],
    underwriterSignOff: {
      name: "Lisa Wang",
      title: "Tax Insurance Underwriter",
      timestamp: "2026-01-22T14:00:00Z",
      decision: "approved",
      comments: "Base tax exposure within appetite despite MLTN opinion level. P&I exclusion addresses tail risk. Favorable audit history supports binding recommendation."
    },
    result: {
      auditTime: "5.1 hours",
      findingsCount: 0,
      remediationRisk: "low"
    }
  },
  environmental: {
    id: "5",
    timestamp: "2026-01-21T11:00:00Z",
    dealName: "Industrial Site Remediation Coverage",
    dealId: "DEAL-2026-009",
    documentsReviewed: [
      { name: "Phase I ESA Report", type: "Environmental Assessment", dateReviewed: "2026-01-18" },
      { name: "Phase II ESA Report", type: "Environmental Assessment", dateReviewed: "2026-01-19" },
      { name: "Remediation Cost Estimate", type: "Engineering Report", dateReviewed: "2026-01-20" },
      { name: "Regulatory Correspondence", type: "Government Records", dateReviewed: "2026-01-20" },
      { name: "Historical Operations Summary", type: "Site History", dateReviewed: "2026-01-19" },
      { name: "Groundwater Monitoring Data", type: "Technical Data", dateReviewed: "2026-01-20" },
    ],
    risksIdentified: [
      {
        title: "Historical PCB Contamination",
        severity: "high",
        sourceDocument: "Phase II ESA Report",
        pageReference: "Section 4.3, Table 4-2",
        description: "PCB contamination in soil at levels requiring remediation. Concentrations exceed regulatory thresholds."
      },
      {
        title: "Groundwater Impact Uncertainty",
        severity: "medium",
        sourceDocument: "Groundwater Monitoring Data",
        pageReference: "Well MW-3 Results",
        description: "Downgradient monitoring shows trace detections - additional delineation may be required."
      }
    ],
    binderAlignment: [
      { clause: "Cost Cap Limit: $3,000,000", status: "compliant", notes: "Above known remediation estimate ($1.8-2.4M)" },
      { clause: "Baseline Contamination Exclusion", status: "excluded", notes: "Known conditions excluded per standard terms" },
      { clause: "Regulatory Reopener Coverage", status: "compliant", notes: "Included for unknown conditions" },
      { clause: "Third Party Claims Coverage", status: "compliant", notes: "Standard PLL terms apply" },
    ],
    underwriterSignOff: {
      name: "David Torres",
      title: "Environmental Risk Manager",
      timestamp: "2026-01-21T11:00:00Z",
      decision: "approved",
      comments: "Cost cap provides adequate buffer above remediation estimates. Baseline exclusion appropriately addresses known PCB conditions. Groundwater uncertainty priced into premium. Approved for binding."
    },
    result: {
      auditTime: "6.2 hours",
      findingsCount: 0,
      remediationRisk: "low"
    }
  },
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

const alignmentStatusColors: Record<string, string> = {
  compliant: "bg-success/10 text-success border-success/20",
  exception: "bg-warning/10 text-warning border-warning/20",
  excluded: "bg-muted text-muted-foreground border-muted",
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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AuditTrail() {
  const [activeTab, setActiveTab] = useState("title");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <DashboardHeader 
          title="Audit Trail" 
          subtitle="Pre-bind underwriting records with full compliance documentation" 
        />
        <main className="p-6">
          {/* Benefits Banner */}
          <Card className="glass-card mb-6 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Result: Faster audits, fewer findings, lower remediation risk
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complete documentation trail reduces audit time by 60% and eliminates compliance gaps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              {productLines.map((line) => (
                <TabsTrigger
                  key={line.id}
                  value={line.id}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <line.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{line.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {productLines.map((line) => {
              const record = auditData[line.id];
              if (!record) return null;
              
              const DecisionIcon = decisionIcons[record.underwriterSignOff.decision];

              return (
                <TabsContent key={line.id} value={line.id}>
                  <Card className="glass-card">
                    {/* Header */}
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-semibold">
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
                          </div>
                        </div>
                        <Badge className={`${decisionColors[record.underwriterSignOff.decision]} text-sm px-3 py-1`}>
                          <DecisionIcon className="h-4 w-4 mr-1.5" />
                          {record.underwriterSignOff.decision.charAt(0).toUpperCase() + record.underwriterSignOff.decision.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Section 1: Documents Reviewed */}
                      <div className="rounded-lg border border-border bg-secondary/20 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <FileSearch className="h-5 w-5 text-primary" />
                          <h3 className="text-base font-semibold text-foreground">Documents Reviewed</h3>
                          <Badge variant="outline" className="ml-auto">{record.documentsReviewed.length} documents</Badge>
                        </div>
                        <div className="grid gap-2">
                          {record.documentsReviewed.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-md bg-background/50 border border-border/50">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <span className="text-sm font-medium text-foreground">{doc.name}</span>
                                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-muted-foreground">{formatDate(doc.dateReviewed)}</span>
                                {doc.status && (
                                  <Badge className={
                                    doc.status === "clean" 
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                      : doc.status === "compliant"
                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        : doc.status === "flagged"
                                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                                          : "bg-muted text-muted-foreground"
                                  }>
                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 2: Risks Identified */}
                      <div className="rounded-lg border border-border bg-secondary/20 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="h-5 w-5 text-warning" />
                          <h3 className="text-base font-semibold text-foreground">Risks Identified</h3>
                          <Badge variant="outline" className="ml-auto">{record.risksIdentified.length} risks</Badge>
                        </div>
                        <div className="space-y-3">
                          {record.risksIdentified.map((risk, idx) => (
                            <div key={idx} className="p-4 rounded-md bg-background/50 border border-border/50">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <span className="text-sm font-semibold text-foreground">{risk.title}</span>
                                <Badge className={severityColors[risk.severity]}>
                                  {risk.severity.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5 text-primary">
                                  <BookOpen className="h-3.5 w-3.5" />
                                  {risk.sourceDocument}
                                </span>
                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                  <Link2 className="h-3.5 w-3.5" />
                                  {risk.pageReference}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 3: Binder Alignment */}
                      <div className="rounded-lg border border-border bg-secondary/20 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <FileCheck className="h-5 w-5 text-success" />
                          <h3 className="text-base font-semibold text-foreground">Binder Alignment</h3>
                        </div>
                        <div className="space-y-2">
                          {record.binderAlignment.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-md bg-background/50 border border-border/50">
                              <div className="flex-1">
                                <span className="text-sm font-medium text-foreground">{item.clause}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.notes}</p>
                              </div>
                              <Badge className={alignmentStatusColors[item.status]}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Section 4: Underwriter Sign-Off */}
                      <div className="rounded-lg border border-border bg-secondary/20 p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <PenTool className="h-5 w-5 text-primary" />
                          <h3 className="text-base font-semibold text-foreground">Underwriter Sign-Off</h3>
                        </div>
                        <div className="p-4 rounded-md bg-background/50 border border-border/50">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-semibold text-foreground">{record.underwriterSignOff.name}</span>
                                <span className="text-xs text-muted-foreground">{record.underwriterSignOff.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {record.underwriterSignOff.comments}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                Signed: {formatTimestamp(record.underwriterSignOff.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button className="bg-primary hover:bg-primary/90">
                            Complete Sign Off
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      {/* Result Summary */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{record.result.auditTime}</p>
                            <p className="text-xs text-muted-foreground">Audit Time</p>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div className="text-center">
                            <p className="text-2xl font-bold text-success">{record.result.findingsCount}</p>
                            <p className="text-xs text-muted-foreground">Findings</p>
                          </div>
                          <Separator orientation="vertical" className="h-10" />
                          <div className="text-center">
                            <Badge className={severityColors[record.result.remediationRisk]}>
                              {record.result.remediationRisk.toUpperCase()}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">Remediation Risk</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Audit-ready documentation
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </main>
      </div>
    </div>
  );
}
