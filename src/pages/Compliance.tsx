import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText, Shield, Leaf, Scale, Banknote } from "lucide-react";

const productLines = [
  { id: "title", label: "Title", icon: FileText },
  { id: "w_and_i", label: "W&I", icon: Shield },
  { id: "contingent_risk", label: "Contingent Risk", icon: Scale },
  { id: "tax", label: "Tax", icon: Banknote },
  { id: "environmental", label: "Environmental", icon: Leaf },
];

interface ComplianceItem {
  id: string;
  name: string;
  description: string;
  status: "compliant" | "flagged";
  category: string;
}

const complianceData: Record<string, ComplianceItem[]> = {
  title: [
    {
      id: "1",
      name: "Title Search Verification",
      description: "All title searches completed and verified against county records",
      status: "compliant",
      category: "title",
    },
    {
      id: "2",
      name: "Lien Documentation",
      description: "All existing liens properly documented and disclosed",
      status: "compliant",
      category: "title",
    },
    {
      id: "3",
      name: "Ownership Chain Review",
      description: "Chain of ownership verified for the past 30 years",
      status: "compliant",
      category: "title",
    },
    {
      id: "4",
      name: "Encumbrance Analysis",
      description: "All encumbrances identified and assessed for risk",
      status: "compliant",
      category: "title",
    },
    {
      id: "5",
      name: "Survey Discrepancy",
      description: "Property boundary survey shows potential encroachment issue requiring resolution",
      status: "flagged",
      category: "title",
    },
  ],
  w_and_i: [
    {
      id: "1",
      name: "Warranty Scope Review",
      description: "All warranty terms reviewed and within acceptable limits",
      status: "compliant",
      category: "w_and_i",
    },
    {
      id: "2",
      name: "Indemnity Cap Analysis",
      description: "Indemnity caps properly structured and documented",
      status: "compliant",
      category: "w_and_i",
    },
  ],
  contingent_risk: [
    {
      id: "1",
      name: "Litigation Reserve Assessment",
      description: "Pending litigation reserves adequately funded",
      status: "compliant",
      category: "contingent_risk",
    },
  ],
  tax: [
    {
      id: "1",
      name: "Tax Liability Review",
      description: "All tax liabilities properly disclosed and assessed",
      status: "compliant",
      category: "tax",
    },
  ],
  environmental: [
    {
      id: "1",
      name: "Phase I Assessment",
      description: "Environmental Phase I assessment completed without issues",
      status: "compliant",
      category: "environmental",
    },
  ],
};

export default function Compliance() {
  const [activeTab, setActiveTab] = useState("title");

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
    const items = complianceData[category] || [];
    const compliant = items.filter((i) => i.status === "compliant").length;
    const flagged = items.filter((i) => i.status === "flagged").length;
    return { compliant, flagged, total: items.length };
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <DashboardHeader title="Compliance" subtitle="Review compliance status across all product lines" />
        <main className="p-6">

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
              const items = complianceData[line.id] || [];
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
                    {items.length === 0 ? (
                      <Card className="glass-card">
                        <CardContent className="p-6 text-center text-muted-foreground">
                          No compliance items for this product line
                        </CardContent>
                      </Card>
                    ) : (
                      items.map((item) => (
                        <Card
                          key={item.id}
                          className={`glass-card transition-all duration-200 hover:border-primary/30 ${
                            item.status === "flagged" ? "border-warning/30" : ""
                          }`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg font-semibold">
                                {item.name}
                              </CardTitle>
                              {getStatusBadge(item.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))
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
