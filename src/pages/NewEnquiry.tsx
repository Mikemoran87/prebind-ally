import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FileText,
  Building2,
  Mail,
  Calendar,
  PoundSterling,
  MapPin,
  User,
  Phone,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Sample Title enquiry data
const sampleTitleEnquiry = {
  broker: {
    name: "Howden Group",
    contact: "Joe Bloggs",
    email: "joebloggs@howdengroup.com",
    phone: "+44 (0)20 7623 3806",
    reference: "HG-2024-TI-00892",
  },
  submission: {
    receivedDate: "2026-01-26",
    responseDeadline: "2026-01-30",
    priority: "high",
    status: "pending_review",
  },
  transaction: {
    type: "Commercial Real Estate Acquisition",
    propertyAddress: "22 Bishopsgate, London EC2N 4BQ",
    purchasePrice: 245000000,
    currency: "GBP",
    closingDate: "2024-02-15",
    buyer: "Legal & General Capital",
    seller: "Aviva Investors",
    target: "22 Bishopsgate Limited",
  },
  coverageRequested: {
    policyLimit: 50000000,
    retention: "Excess Nil",
    coverageType: "Title to Real Estate - All Unknown Risks",
    endorsements: ["Absence of Easement Risk", "Adverse Possession Risk"],
  },
  documents: [
    {
      id: "1",
      name: "Legal Due Diligence Report - Squire Patton Boggs.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedAt: "2024-01-22",
      status: "uploaded",
    },
    {
      id: "2",
      name: "RICS Building Survey Report.pdf",
      type: "pdf",
      size: "8.1 MB",
      uploadedAt: "2024-01-22",
      status: "uploaded",
    },
    {
      id: "3",
      name: "Statutory Declaration re: Long Use of Services - Executed.pdf",
      type: "pdf",
      size: "1.8 MB",
      uploadedAt: "2024-01-22",
      status: "uploaded",
    },
    {
      id: "4",
      name: "Planning Permission - City of London.pdf",
      type: "pdf",
      size: "456 KB",
      uploadedAt: "2024-01-22",
      status: "uploaded",
    },
    {
      id: "5",
      name: "Statutory Declaration re: Long Use of Possessory Plot - Executed.pdf",
      type: "pdf",
      size: "1.2 MB",
      uploadedAt: "2024-01-22",
      status: "uploaded",
    },
  ],
  notes: `Broker indicates this is a priority transaction for a key institutional client. The property is a mixed-use commercial office tower in the City of London with ground floor retail.

Key considerations:
- Complex chain of title with historic leasehold interests
- Specific absence of easement risk for services requested
- Specific adverse possession risk on ground floor retail unit requested

Client seeking competitive quote for all unknown risk title to real estate coverage including two specific risk requests.`,
};

const productLines = [
  { id: "title", label: "Title", count: 1 },
  { id: "w_and_i", label: "W&I", count: 0 },
  { id: "contingent_risk", label: "Contingent Risk", count: 0 },
  { id: "tax", label: "Tax", count: 0 },
  { id: "environmental", label: "Environmental", count: 0 },
];

export default function NewEnquiry() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("title");
  const [isCreating, setIsCreating] = useState(false);

  // Mark that user has visited New Enquiry
  useEffect(() => {
    localStorage.setItem("hasVisitedNewEnquiry", "true");
  }, []);

  const generateDealId = () => {
    const prefix = "TI";
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `${prefix}-${year}-${random}`;
  };

  const handleCreateDeal = async () => {
    setIsCreating(true);
    try {
      const dealId = generateDealId();
      
      const { data, error } = await supabase
        .from("deals")
        .insert({
          deal_id: dealId,
          title: `${sampleTitleEnquiry.transaction.type} - ${sampleTitleEnquiry.transaction.propertyAddress}`,
          category: "title" as const,
          status: "new" as const,
          client_name: sampleTitleEnquiry.broker.name,
          client_email: sampleTitleEnquiry.broker.email,
          transaction_value: sampleTitleEnquiry.transaction.purchasePrice,
          currency: sampleTitleEnquiry.transaction.currency,
          summary: sampleTitleEnquiry.notes,
          email_subject: `Broker Submission: ${sampleTitleEnquiry.broker.reference}`,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Deal created successfully", {
        description: `Deal ${dealId} has been created and added to your deals.`,
      });

      navigate("/deals");
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error("Failed to create deal", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="outline" className="border-amber-500/50 bg-amber-500/10 text-amber-400"><Clock className="mr-1 h-3 w-3" />Pending Review</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary"><AlertTriangle className="mr-1 h-3 w-3" />In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Medium</Badge>;
      case "low":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              New Enquiry
            </h1>
            <p className="mt-2 text-muted-foreground">
              Review and process incoming broker submissions across product lines
            </p>
          </div>

          {/* Product Line Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              {productLines.map((line) => (
                <TabsTrigger
                  key={line.id}
                  value={line.id}
                  className="data-[state=active]:bg-background data-[state=active]:text-primary relative"
                >
                  {line.label}
                  {line.count > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
                      {line.count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Title Tab Content */}
            <TabsContent value="title" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Broker & Submission Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Broker Details Card */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                            Broker Submission
                          </CardTitle>
                          <CardDescription>Reference: {sampleTitleEnquiry.broker.reference}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(sampleTitleEnquiry.submission.priority)}
                          {getStatusBadge(sampleTitleEnquiry.submission.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Broker:</span>
                            <span className="font-medium text-foreground">{sampleTitleEnquiry.broker.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="font-medium text-foreground">{sampleTitleEnquiry.broker.contact}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium text-primary">{sampleTitleEnquiry.broker.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium text-foreground">{sampleTitleEnquiry.broker.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Received:</span>
                            <span className="font-medium text-foreground">{sampleTitleEnquiry.submission.receivedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Response Due:</span>
                            <span className="font-medium text-amber-400">{sampleTitleEnquiry.submission.responseDeadline}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction Details Card */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PoundSterling className="h-5 w-5 text-primary" />
                        Transaction Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Transaction Type</span>
                            <p className="font-medium text-foreground">{sampleTitleEnquiry.transaction.type}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Buyer</span>
                            <p className="font-medium text-foreground">{sampleTitleEnquiry.transaction.buyer}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Seller</span>
                            <p className="font-medium text-foreground">{sampleTitleEnquiry.transaction.seller}</p>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Target</span>
                            <p className="font-medium text-foreground">{sampleTitleEnquiry.transaction.target}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Purchase Price</span>
                            <p className="font-display text-xl font-bold text-primary">
                              {formatCurrency(sampleTitleEnquiry.transaction.purchasePrice)}
                            </p>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Closing Date</span>
                            <p className="font-medium text-foreground">{sampleTitleEnquiry.transaction.closingDate}</p>
                          </div>
                        </div>
                      </div>
                      <Separator className="bg-border/50" />
                      <div className="text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-muted-foreground">Property Address</span>
                            <p className="font-medium text-foreground">{sampleTitleEnquiry.transaction.propertyAddress}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Coverage Requested Card */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-primary" />
                        Coverage Requested
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Policy Limit</p>
                          <p className="font-display text-xl font-bold text-primary mt-1">
                            {formatCurrency(sampleTitleEnquiry.coverageRequested.policyLimit)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Retention</p>
                          <p className="font-display text-xl font-bold text-foreground mt-1">
                            {sampleTitleEnquiry.coverageRequested.retention}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Coverage Type</p>
                          <p className="font-medium text-foreground mt-1">
                            {sampleTitleEnquiry.coverageRequested.coverageType}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Requested Specific Risk Coverage</p>
                        <div className="flex flex-wrap gap-2">
                          {sampleTitleEnquiry.coverageRequested.endorsements.map((endorsement) => (
                            <Badge key={endorsement} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {endorsement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Broker Notes Card */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Broker Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                        <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                          {sampleTitleEnquiry.notes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Documents & Actions */}
                <div className="space-y-6">
                  {/* Documents Card */}
                  <Card className="border-border/50 bg-card/50 backdrop-blur">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Upload className="h-5 w-5 text-primary" />
                        Deal Documents
                      </CardTitle>
                      <CardDescription>
                        {sampleTitleEnquiry.documents.length} files uploaded
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[320px] pr-4">
                        <div className="space-y-3">
                          {sampleTitleEnquiry.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="group flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.size} • {doc.uploadedAt}
                                </p>
                              </div>
                              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Actions Card */}
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-500/5 backdrop-blur">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
                        onClick={handleCreateDeal}
                        disabled={isCreating}
                      >
                        {isCreating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        {isCreating ? "Creating..." : "Create New Deal"}
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                      <Button variant="ghost" className="w-full text-muted-foreground">
                        Request More Info
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Empty states for other tabs */}
            {["w_and_i", "contingent_risk", "tax", "environmental"].map((tabId) => (
              <TabsContent key={tabId} value={tabId}>
                <Card className="border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Enquiries</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-sm">
                      There are no new broker enquiries for this product line. New submissions will appear here automatically.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
