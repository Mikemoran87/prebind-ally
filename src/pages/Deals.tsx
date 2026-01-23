import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useDeals } from "@/hooks/useDeals";
import { 
  FileText, 
  Shield, 
  Scale, 
  Landmark, 
  Leaf,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
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

export default function Deals() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("title");
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="ml-64">
        <DashboardHeader
          title="Deals"
          subtitle="View and manage all deals across product lines"
        />

        <div className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-5 bg-muted/30 p-1">
              {productLines.map((line) => {
                const count = getDealsByCategory(line.id).length;
                return (
                  <TabsTrigger
                    key={line.id}
                    value={line.id}
                    className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <line.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{line.label}</span>
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {productLines.map((line) => (
              <TabsContent key={line.id} value={line.id} className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : getDealsByCategory(line.id).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <line.icon className="mb-4 h-12 w-12 opacity-50" />
                    <p>No {line.label} deals yet</p>
                  </div>
                ) : (
                  getDealsByCategory(line.id).map((deal) => (
                    <Card
                      key={deal.id}
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      className="group cursor-pointer border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {deal.title}
                            </h3>
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
                          {deal.summary && (
                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground/80">
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

                          {deal.overall_risk_score && (
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

                          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
