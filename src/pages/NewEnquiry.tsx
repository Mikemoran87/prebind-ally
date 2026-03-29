import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, PlusCircle, FileText } from "lucide-react";

const productLines = [
  { id: "title", label: "Title Insurance" },
  { id: "w_and_i", label: "Warranty & Indemnity (W&I)" },
  { id: "contingent_risk", label: "Contingent Risk" },
  { id: "tax", label: "Tax Liability" },
  { id: "environmental", label: "Environmental" },
];

const generateDealId = (category: string) => {
  const prefixes: Record<string, string> = {
    title: "TI",
    w_and_i: "WI",
    contingent_risk: "CR",
    tax: "TX",
    environmental: "EV",
  };
  const prefix = prefixes[category] || "GN";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${year}-${random}`;
};

export default function NewEnquiry() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const [form, setForm] = useState({
    category: "title",
    brokerName: "",
    brokerEmail: "",
    brokerRef: "",
    transactionType: "",
    propertyAddress: "",
    buyer: "",
    seller: "",
    transactionValue: "",
    currency: "GBP",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateDeal = async () => {
    if (!form.brokerName || !form.transactionType) {
      toast.error("Please fill in at least Broker Name and Transaction Type");
      return;
    }

    setIsCreating(true);
    try {
      const dealId = generateDealId(form.category);
      const title = form.propertyAddress
        ? `${form.transactionType} - ${form.propertyAddress}`
        : form.transactionType;

      const { data, error } = await supabase
        .from("deals")
        .insert({
          deal_id: dealId,
          title,
          category: form.category as "title" | "w_and_i" | "contingent_risk" | "tax" | "environmental",
          status: "new" as const,
          client_name: form.brokerName,
          client_email: form.brokerEmail || null,
          transaction_value: form.transactionValue ? parseFloat(form.transactionValue.replace(/,/g, "")) : null,
          currency: form.currency,
          summary: form.notes || null,
          email_subject: form.brokerRef ? `Broker Submission: ${form.brokerRef}` : null,
          overall_risk_score: null,
        })
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem("demoDealId", data.id);

      toast.success("Deal created successfully", {
        description: `Deal ${dealId} has been created.`,
      });

      navigate(`/deals/${data.id}`);
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Failed to create deal. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8 max-w-3xl mx-auto">
          {/* Header with step indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground font-bold text-xs">1</span>
              <span className="font-medium text-primary">Enter Deal Details</span>
              <span className="text-border mx-1">→</span>
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-border text-muted-foreground font-bold text-xs">2</span>
              <span>Upload Documents</span>
              <span className="text-border mx-1">→</span>
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-border text-muted-foreground font-bold text-xs">3</span>
              <span>AI Analysis</span>
              <span className="text-border mx-1">→</span>
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-border text-muted-foreground font-bold text-xs">4</span>
              <span>Sign Off</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <PlusCircle className="h-6 w-6 text-primary" />
              <h1 className="font-display text-3xl font-bold text-foreground">New Enquiry</h1>
            </div>
            <p className="text-muted-foreground">Fill in the broker submission details. You'll upload documents and run AI analysis in the next step.</p>
          </div>

          <div className="space-y-6">
            {/* Product Line */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Product Line
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {productLines.map((line) => (
                    <button
                      key={line.id}
                      onClick={() => handleChange("category", line.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.category === line.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {line.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Broker Details */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Broker Details</CardTitle>
                <CardDescription>Who submitted this enquiry?</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brokerName">Broker / Firm Name *</Label>
                  <Input
                    id="brokerName"
                    placeholder="e.g. Howden Group"
                    value={form.brokerName}
                    onChange={(e) => handleChange("brokerName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brokerEmail">Broker Email</Label>
                  <Input
                    id="brokerEmail"
                    type="email"
                    placeholder="broker@firm.com"
                    value={form.brokerEmail}
                    onChange={(e) => handleChange("brokerEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="brokerRef">Broker Reference</Label>
                  <Input
                    id="brokerRef"
                    placeholder="e.g. HG-2026-TI-00441"
                    value={form.brokerRef}
                    onChange={(e) => handleChange("brokerRef", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Transaction Details</CardTitle>
                <CardDescription>What is being insured?</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="transactionType">Transaction Type *</Label>
                  <Input
                    id="transactionType"
                    placeholder="e.g. Commercial Real Estate Acquisition"
                    value={form.transactionType}
                    onChange={(e) => handleChange("transactionType", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="propertyAddress">Property / Target Address</Label>
                  <Input
                    id="propertyAddress"
                    placeholder="e.g. 14-18 Harbour Exchange Square, London E14 9GE"
                    value={form.propertyAddress}
                    onChange={(e) => handleChange("propertyAddress", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buyer">Buyer / Insured</Label>
                  <Input
                    id="buyer"
                    placeholder="e.g. Legal & General Capital"
                    value={form.buyer}
                    onChange={(e) => handleChange("buyer", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller">Seller</Label>
                  <Input
                    id="seller"
                    placeholder="e.g. Canary Wharf Group"
                    value={form.seller}
                    onChange={(e) => handleChange("seller", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionValue">Transaction Value</Label>
                  <Input
                    id="transactionValue"
                    placeholder="e.g. 87500000"
                    value={form.transactionValue}
                    onChange={(e) => handleChange("transactionValue", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => handleChange("currency", v)}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GBP">GBP £</SelectItem>
                      <SelectItem value="EUR">EUR €</SelectItem>
                      <SelectItem value="USD">USD $</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Broker Notes / Submission Summary</CardTitle>
                <CardDescription>Paste the broker email, key risks, or deal summary here</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g. Broker indicates this is a priority transaction. Key risks: absence of easement, possessory title on north wing..."
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="min-h-[140px] resize-y"
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-8">
              <Button variant="outline" onClick={() => navigate("/deals")}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 gap-2"
                onClick={handleCreateDeal}
                disabled={isCreating}
              >
                {isCreating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Creating...</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" />Create New Deal</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
