import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDeals } from "@/hooks/useDeals";
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Leaf, 
  Scale, 
  Landmark,
  ArrowRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const productLines = [
  { id: "title", label: "Title", icon: FileText },
  { id: "w_and_i", label: "W&I", icon: Shield },
  { id: "contingent_risk", label: "Contingent Risk", icon: Scale },
  { id: "tax", label: "Tax", icon: Landmark },
  { id: "environmental", label: "Environmental", icon: Leaf },
] as const;

const statusColors: Record<string, string> = {
  new: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  in_review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  analyzed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  declined: "bg-red-500/20 text-red-400 border-red-500/30",
};

const riskScoreColor = (score: number | null) => {
  if (!score) return "text-muted-foreground";
  if (score >= 70) return "text-red-400";
  if (score >= 40) return "text-amber-400";
  return "text-emerald-400";
};

// Determine compliance status based on risk score
const getComplianceStatus = (riskScore: number | null): "compliant" | "flagged" => {
  if (!riskScore) return "compliant";
  return riskScore >= 50 ? "flagged" : "compliant";
};

export default function Compliance() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("title");
  const { data: deals, isLoading } = useDeals();

  const getDealsByCategory = (category: string) => {
    return deals?.filter((deal) => deal.category === category) || [];
  };

  const formatCurrency = (value: number | null, currency: string | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: "compliant" | "flagged") => {
    if (status === "compliant") {
      return (
        <Badge className="bg-success/10 text-success border-success/20 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Compliant
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning/10 text-warning border-warning/20 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Flagged
      </Badge>
    );
  };

  const getCounts = (category: string) => {
    const categoryDeals = getDealsByCategory(category);
    const compliant = categoryDeals.filter((d) => getComplianceStatus(d.overall_risk_score) === "compliant").length;
    const flagged = categoryDeals.filter((d) => getComplianceStatus(d.overall_risk_score) === "flagged").length;
    return { compliant, flagged, total: categoryDeals.length };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <DashboardHeader title="Binder Compliance" subtitle="Review compliance status across all product lines" />
        <main className="p-6">
          {/* Compliance Metrics */}
          {deals && deals.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{deals.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Bound</p>
              </Card>
              <Card className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {deals.filter(d => getComplianceStatus(d.overall_risk_score) === 'compliant').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Compliant</p>
              </Card>
              <Card className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">
                  {deals.filter(d => getComplianceStatus(d.overall_risk_score) === 'flagged').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Flagged</p>
              </Card>
              <Card className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {deals.length > 0 ? Math.round((deals.filter(d => getComplianceStatus(d.overall_risk_score) === 'compliant').length / deals.length) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Compliance Rate</p>
              </Card>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              {productLines.map((line) => {
                const counts = getCounts(line.id);
                return (
                  <TabsTrigger
                    key={line.id}
                    value={line.id}
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <line.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{line.label}</span>
                    {counts.flagged > 0 && (
                      <span className="ml-1 rounded-full bg-warning/20 px-1.5 py-0.5 text-xs text-warning">
                        {counts.flagged}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {productLines.map((line) => {
              const categoryDeals = getDealsByCategory(line.id);
              const counts = getCounts(line.id);

              return (
                <TabsContent key={line.id} value={line.id}>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">
                        {counts.compliant} Compliant
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="text-muted-foreground">
                        {counts.flagged} Flagged
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    ) : categoryDeals.length === 0 ? (
                      <Card className="glass-card">
                        <CardContent className="p-6 text-center text-muted-foreground">
                          <line.icon className="mx-auto mb-4 h-12 w-12 opacity-50" />
                          <p>No {line.label} deals yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      categoryDeals.map((deal) => {
                        const complianceStatus = getComplianceStatus(deal.overall_risk_score);
                        return (
                          <Card
                            key={deal.id}
                            onClick={() => navigate(`/deals/${deal.id}?from=compliance`)}
                            className={cn(
                              "group cursor-pointer glass-card transition-all duration-200 hover:border-primary/30",
                              complianceStatus === "flagged" && "border-warning/30"
                            )}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                                      {deal.title}
                                    </CardTitle>
                                    <Badge
                                      variant="outline"
                                      className={cn("capitalize", statusColors[deal.status])}
                                    >
                                      {deal.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {deal.client_name || "Unknown client"} • {deal.deal_id}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  {getStatusBadge(complianceStatus)}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity gap-1 text-xs h-7 px-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const content = [
                                        'PREBIND COMPLIANCE REPORT',
                                        '=========================',
                                        `Deal: ${deal.title}`,
                                        `ID: ${deal.deal_id}`,
                                        `Client: ${deal.client_name || 'N/A'}`,
                                        `Value: ${formatCurrency(deal.transaction_value, deal.currency)}`,
                                        `Status: ${deal.status}`,
                                        `Compliance: ${getComplianceStatus(deal.overall_risk_score).toUpperCase()}`,
                                        `Risk Score: ${deal.overall_risk_score ?? 'N/A'}`,
                                        `Generated: ${new Date().toLocaleString('en-GB')}`,
                                        '',
                                        'prebind.ai',
                                      ].join('\n');
                                      const blob = new Blob([content], { type: 'text/plain' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `Compliance-${deal.deal_id}.txt`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    }}
                                  >
                                    <Download className="h-3 w-3" />
                                    Export
                                  </Button>
                                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <div>
                                  {deal.summary && (
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                      {deal.summary}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-right">
                                    <div className="text-lg font-semibold text-foreground">
                                      {formatCurrency(deal.transaction_value, deal.currency)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Transaction Value
                                    </div>
                                  </div>
                                  {deal.overall_risk_score !== null && (
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle
                                        className={cn("h-4 w-4", riskScoreColor(deal.overall_risk_score))}
                                      />
                                      <span
                                        className={cn(
                                          "text-lg font-bold",
                                          riskScoreColor(deal.overall_risk_score)
                                        )}
                                      >
                                        {deal.overall_risk_score}
                                      </span>
                                    </div>
                                  )}
                                </div>
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
