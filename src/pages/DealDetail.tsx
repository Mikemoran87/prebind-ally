import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, Download, RefreshCw, Building2, Users, Target, ShieldAlert, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeal, useDealDocuments, useDealRisks, useDealReport, useAnalyzeDocuments } from '@/hooks/useDeals';
import { CATEGORY_LABELS, STATUS_LABELS, SEVERITY_COLORS, RiskSeverity } from '@/types/deals';
import { formatDistanceToNow, format } from 'date-fns';
import { Sidebar } from '@/components/dashboard/Sidebar';

function getReviewStatusBadge(status: string | null, isAnalyzed: boolean | null) {
  if (!isAnalyzed) {
    return <Badge variant="secondary">Pending</Badge>;
  }
  
  switch (status) {
    case 'clean':
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Clean</Badge>;
    case 'compliant':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Compliant</Badge>;
    case 'flagged':
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Flagged</Badge>;
    default:
      return <Badge variant="default">Analyzed</Badge>;
  }
}

function DocumentsList({ dealId, autoExpandFlagged = false }: { dealId: string; autoExpandFlagged?: boolean }) {
  const { data: documents, isLoading } = useDealDocuments(dealId);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  useEffect(() => {
    if (autoExpandFlagged && documents) {
      const flaggedDoc = documents.find((doc) => (doc as any).review_status === 'flagged');
      if (flaggedDoc) {
        setExpandedDoc(flaggedDoc.id);
      }
    }
  }, [autoExpandFlagged, documents]);

  if (isLoading) return <div className="text-muted-foreground">Loading documents...</div>;

  const getFlaggedMessage = (fileName: string) => {
    if (fileName.includes('Long Use of Services')) {
      return 'Statutory requirement of twenty years use of services not reached.';
    }
    return null;
  };

  return (
    <div className="space-y-2">
      {documents?.map((doc) => {
        const isFlagged = (doc as any).review_status === 'flagged';
        const isExpanded = expandedDoc === doc.id;
        const flaggedMessage = getFlaggedMessage(doc.file_name);

        return (
          <div key={doc.id}>
            <div 
              className={`flex items-center justify-between p-3 bg-muted rounded-lg ${isFlagged ? 'cursor-pointer hover:bg-muted/80 transition-colors' : ''}`}
              onClick={() => isFlagged && setExpandedDoc(isExpanded ? null : doc.id)}
            >
              <div className="flex items-center gap-3">
                {isFlagged ? (
                  isExpanded ? <ChevronDown className="h-5 w-5 text-red-400" /> : <ChevronRight className="h-5 w-5 text-red-400" />
                ) : (
                  <FileText className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-sm">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'} • 
                    {doc.is_analyzed ? ' Analyzed' : ' Pending analysis'}
                  </p>
                </div>
              </div>
              {getReviewStatusBadge((doc as any).review_status, doc.is_analyzed)}
            </div>
            {isFlagged && isExpanded && flaggedMessage && (
              <div className="ml-8 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300">
                <AlertTriangle className="h-4 w-4 inline-block mr-2 text-red-400" />
                {flaggedMessage}
              </div>
            )}
          </div>
        );
      })}
      {documents?.length === 0 && (
        <p className="text-muted-foreground text-center py-4">No documents attached</p>
      )}
    </div>
  );
}

function RisksList({ dealId, analysisStarted }: { dealId: string; analysisStarted: boolean }) {
  const { data: risks, isLoading } = useDealRisks(dealId);
  const [recommendation, setRecommendation] = useState('');

  if (isLoading) return <div className="text-muted-foreground">Loading risks...</div>;

  const groupedRisks = risks?.reduce((acc, risk) => {
    if (!acc[risk.severity]) acc[risk.severity] = [];
    acc[risk.severity].push(risk);
    return acc;
  }, {} as Record<RiskSeverity, typeof risks>);

  const severityOrder: RiskSeverity[] = ['critical', 'high', 'medium', 'low'];

  return (
    <div className="space-y-6">
      {/* Underwriter's Risk Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle>Underwriter's Risk Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            placeholder="Enter your recommendation here..."
            className="w-full min-h-[150px] p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
        </CardContent>
      </Card>

      {severityOrder.map((severity) => {
        const severityRisks = groupedRisks?.[severity];
        if (!severityRisks?.length) return null;

        return (
          <div key={severity}>
            <h4 className="font-semibold capitalize mb-3 flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${severity === 'critical' || severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'}`} />
              {severity} Risks ({severityRisks.length})
            </h4>
            <div className="space-y-3">
              {severityRisks.map((risk) => (
                <Card key={risk.id} className={`border-l-4 ${severity === 'critical' ? 'border-l-red-500' : severity === 'high' ? 'border-l-orange-500' : severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{risk.risk_category}</Badge>
                          {risk.is_material && <Badge className="bg-red-100 text-red-800">Material</Badge>}
                        </div>
                        <h5 className="font-semibold">{risk.risk_title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{risk.risk_description}</p>
                        {risk.source_excerpt && (
                          <blockquote className="mt-2 pl-3 border-l-2 border-muted text-sm italic text-muted-foreground">
                            "{risk.source_excerpt}"
                          </blockquote>
                        )}
                        {risk.recommendation && (
                          <p className="mt-2 text-sm">
                            <strong>Recommendation:</strong> {risk.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      {risks?.length === 0 && !analysisStarted && (
        <p className="text-muted-foreground text-center py-4">
          No risks identified yet. Run analysis to identify risks.
        </p>
      )}
    </div>
  );
}

function UnderwritingReport({ dealId }: { dealId: string }) {
  const { data: report, isLoading } = useDealReport(dealId);
  const [rationale, setRationale] = useState('');
  const [riskCounts, setRiskCounts] = useState({
    total_risks: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const handleRiskClick = (key: keyof typeof riskCounts) => {
    setRiskCounts((prev) => ({
      ...prev,
      [key]: prev[key] === 0 ? 1 : prev[key],
      total_risks: key !== 'total_risks' ? prev.total_risks + (prev[key] === 0 ? 1 : 0) : (prev.total_risks === 0 ? 1 : prev.total_risks),
    }));
  };

  if (isLoading) return <div className="text-muted-foreground">Loading report...</div>;

  if (!report) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No underwriting report generated yet.</p>
        <p className="text-sm">Run document analysis to generate a report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coverage Analysis */}
      {report.coverage_analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Coverage Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {report.coverage_analysis.suggested_limit && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Suggested Limit</p>
                  <p className="font-semibold">{report.coverage_analysis.suggested_limit}</p>
                </div>
              )}
              {report.coverage_analysis.retention && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Excess</p>
                  <p className="font-semibold">{report.coverage_analysis.retention}</p>
                </div>
              )}
              <div className="p-3 bg-muted rounded-lg md:col-span-3">
                <p className="text-sm text-muted-foreground">Structure</p>
                <p className="font-semibold">A ground up purchaser's title to real estate, all unknown risk policy requested. This will provide comprehensive coverage against unknown or undiscovered title defects that may have existed prior to the policy date on a continued use basis.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            This is a priority transaction for a key institutional client. The property is a mixed-use commercial office tower in the City of London with ground floor retail.
            {'\n\n'}
            <span className="font-medium text-foreground">Key considerations:</span>
            {'\n'}• Complex chain of title with historic leasehold interests
            {'\n'}• Specific absence of easement risk for services requested
            {'\n'}• Specific adverse possession risk on ground floor retail unit requested
            {'\n\n'}
            Client seeking competitive quote for all unknown risk title to real estate coverage including two specific risk requests.
          </p>
        </CardContent>
      </Card>

      {/* Underwriter's Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Underwriter's Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Enter your risk assessment rationale here..."
            className="w-full min-h-[150px] p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
          />
        </CardContent>
      </Card>

      {/* Risk Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div 
              className="text-center p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleRiskClick('total_risks')}
            >
              <p className="text-2xl font-bold">{riskCounts.total_risks}</p>
              <p className="text-sm text-muted-foreground">Total Risks</p>
            </div>
            <div 
              className="text-center p-3 bg-red-500/10 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors"
              onClick={() => handleRiskClick('critical')}
            >
              <p className="text-2xl font-bold text-red-400">{riskCounts.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
            <div 
              className="text-center p-3 bg-orange-500/10 rounded-lg cursor-pointer hover:bg-orange-500/20 transition-colors"
              onClick={() => handleRiskClick('high')}
            >
              <p className="text-2xl font-bold text-orange-400">{riskCounts.high}</p>
              <p className="text-sm text-muted-foreground">High</p>
            </div>
            <div 
              className="text-center p-3 bg-yellow-500/10 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors"
              onClick={() => handleRiskClick('medium')}
            >
              <p className="text-2xl font-bold text-yellow-400">{riskCounts.medium}</p>
              <p className="text-sm text-muted-foreground">Medium</p>
            </div>
            <div 
              className="text-center p-3 bg-green-500/10 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors"
              onClick={() => handleRiskClick('low')}
            >
              <p className="text-2xl font-bold text-green-400">{riskCounts.low}</p>
              <p className="text-sm text-muted-foreground">Low</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Save Report
        </Button>
      </div>
    </div>
  );
}

export default function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: deal, isLoading } = useDeal(id);
  const analyzeDocuments = useAnalyzeDocuments();
  const showFlagged = searchParams.get('showFlagged') === 'true';
  const [analysisStarted, setAnalysisStarted] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <p>Loading deal...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <p>Deal not found</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-lg text-muted-foreground">{deal.deal_id}</span>
                  <Badge>{CATEGORY_LABELS[deal.category]}</Badge>
                  <Badge variant="outline">{STATUS_LABELS[deal.status]}</Badge>
                </div>
                <h1 className="text-2xl font-bold">{deal.title}</h1>
                {deal.client_name && (
                  <p className="text-muted-foreground mt-1">{deal.client_name}</p>
                )}

                {/* Buyer, Seller, Target, Risk Type boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Buyer</p>
                      <p className="font-medium text-foreground text-sm">Legal & General Capital</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Seller</p>
                      <p className="font-medium text-foreground text-sm">Aviva Investors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Target</p>
                      <p className="font-medium text-foreground text-sm">22 Bishopsgate, London</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-card/50">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Type</p>
                      <p className="font-medium text-foreground text-sm">Title to Real Estate</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {deal.overall_risk_score !== null && (
                  <div className={`text-3xl font-bold ${32 >= 70 ? 'text-red-600' : 32 >= 40 ? 'text-orange-600' : 'text-green-600'}`}>
                    Risk Score: 32%
                  </div>
                )}
                <Button 
                  onClick={() => {
                    setAnalysisStarted(true);
                    analyzeDocuments.mutate(deal.id);
                  }}
                  disabled={analyzeDocuments.isPending}
                  className="gap-2"
                >
                  {analyzeDocuments.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {analyzeDocuments.isPending ? 'Analyzing...' : 'Analyze Documents'}
                </Button>
              </div>
            </div>
          </div>

          {/* Deal Info Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {deal.transaction_value && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Transaction Value</p>
                  <p className="text-xl font-bold">
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: deal.currency || 'GBP',
                      maximumFractionDigits: 0,
                    }).format(deal.transaction_value)}
                  </p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-xl font-bold">
                  {deal.email_received_at 
                    ? format(new Date(deal.email_received_at), 'MMM d, yyyy')
                    : format(new Date(deal.created_at), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>
            {deal.client_email && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Client Email</p>
                  <p className="text-sm font-medium truncate">{deal.client_email}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-xl font-bold">{STATUS_LABELS[deal.status]}</p>
              </CardContent>
            </Card>
          </div>


          {/* Tabs for Documents, Risks, Report */}
          <Tabs defaultValue={showFlagged ? "documents" : "report"} className="space-y-4">
            <TabsList>
              <TabsTrigger value="report">Underwriter Risk Assessment</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="report">
              <UnderwritingReport dealId={deal.id} />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Attached Documents</CardTitle>
                  <CardDescription>Documents extracted from the enquiry email</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentsList dealId={deal.id} autoExpandFlagged={showFlagged} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks">
              <RisksList dealId={deal.id} analysisStarted={analysisStarted} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
