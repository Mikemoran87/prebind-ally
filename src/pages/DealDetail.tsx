import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeal, useDealDocuments, useDealRisks, useDealReport, useAnalyzeDocuments } from '@/hooks/useDeals';
import { CATEGORY_LABELS, STATUS_LABELS, SEVERITY_COLORS, RiskSeverity } from '@/types/deals';
import { formatDistanceToNow, format } from 'date-fns';
import { Sidebar } from '@/components/dashboard/Sidebar';

function DocumentsList({ dealId }: { dealId: string }) {
  const { data: documents, isLoading } = useDealDocuments(dealId);

  if (isLoading) return <div className="text-muted-foreground">Loading documents...</div>;

  return (
    <div className="space-y-2">
      {documents?.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{doc.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : 'Unknown size'} • 
                {doc.is_analyzed ? ' Analyzed' : ' Pending analysis'}
              </p>
            </div>
          </div>
          <Badge variant={doc.is_analyzed ? 'default' : 'secondary'}>
            {doc.is_analyzed ? 'Analyzed' : 'Pending'}
          </Badge>
        </div>
      ))}
      {documents?.length === 0 && (
        <p className="text-muted-foreground text-center py-4">No documents attached</p>
      )}
    </div>
  );
}

function RisksList({ dealId }: { dealId: string }) {
  const { data: risks, isLoading } = useDealRisks(dealId);

  if (isLoading) return <div className="text-muted-foreground">Loading risks...</div>;

  const groupedRisks = risks?.reduce((acc, risk) => {
    if (!acc[risk.severity]) acc[risk.severity] = [];
    acc[risk.severity].push(risk);
    return acc;
  }, {} as Record<RiskSeverity, typeof risks>);

  const severityOrder: RiskSeverity[] = ['critical', 'high', 'medium', 'low'];

  return (
    <div className="space-y-6">
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
      {risks?.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No risks identified yet. Run analysis to identify risks.
        </p>
      )}
    </div>
  );
}

function UnderwritingReport({ dealId }: { dealId: string }) {
  const { data: report, isLoading } = useDealReport(dealId);

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
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{report.executive_summary}</p>
        </CardContent>
      </Card>

      {/* Risk Overview */}
      {report.risk_overview && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{report.risk_overview.total_risks || 0}</p>
                <p className="text-sm text-muted-foreground">Total Risks</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{report.risk_overview.critical || 0}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{report.risk_overview.high || 0}</p>
                <p className="text-sm text-muted-foreground">High</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{report.risk_overview.medium || 0}</p>
                <p className="text-sm text-muted-foreground">Medium</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{report.risk_overview.low || 0}</p>
                <p className="text-sm text-muted-foreground">Low</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Findings */}
      {report.key_findings && Array.isArray(report.key_findings) && (
        <Card>
          <CardHeader>
            <CardTitle>Key Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.key_findings.map((finding: any, index: number) => (
                <div key={index} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={SEVERITY_COLORS[finding.severity as RiskSeverity] || 'bg-gray-100'}>
                      {finding.severity}
                    </Badge>
                    <span className="font-semibold">{finding.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{finding.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {report.recommendations && Array.isArray(report.recommendations) && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.recommendations.map((rec: any, index: number) => (
                <div key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                  <div>
                    <p className="font-medium">{rec.action}</p>
                    {rec.rationale && (
                      <p className="text-sm text-muted-foreground mt-1">{rec.rationale}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                  <p className="text-sm text-muted-foreground">Retention</p>
                  <p className="font-semibold">{report.coverage_analysis.retention}</p>
                </div>
              )}
              {report.coverage_analysis.structure && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Structure</p>
                  <p className="font-semibold">{report.coverage_analysis.structure}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exclusions */}
      {report.exclusions_review && Array.isArray(report.exclusions_review) && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Exclusions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.exclusions_review.map((exc: any, index: number) => (
                <div key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{exc.exclusion}</p>
                    <p className="text-sm text-muted-foreground">{exc.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

export default function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: deal, isLoading } = useDeal(id);
  const analyzeDocuments = useAnalyzeDocuments();

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <p>Loading deal...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <p>Deal not found</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
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
              </div>

              <div className="flex flex-col items-end gap-2">
                {deal.overall_risk_score !== null && (
                  <div className={`text-3xl font-bold ${deal.overall_risk_score >= 70 ? 'text-red-600' : deal.overall_risk_score >= 40 ? 'text-orange-600' : 'text-green-600'}`}>
                    Risk Score: {deal.overall_risk_score}
                  </div>
                )}
                <Button 
                  onClick={() => analyzeDocuments.mutate(deal.id)}
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
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: deal.currency || 'USD',
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

          {/* Summary */}
          {deal.summary && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Deal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{deal.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Tabs for Documents, Risks, Report */}
          <Tabs defaultValue="report" className="space-y-4">
            <TabsList>
              <TabsTrigger value="report">Underwriting Report</TabsTrigger>
              <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="report">
              <UnderwritingReport dealId={deal.id} />
            </TabsContent>

            <TabsContent value="risks">
              <RisksList dealId={deal.id} />
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Attached Documents</CardTitle>
                  <CardDescription>Documents extracted from the enquiry email</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentsList dealId={deal.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
