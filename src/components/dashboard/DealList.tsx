import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeals, useAnalyzeDocuments } from '@/hooks/useDeals';
import { Deal, DealCategory, CATEGORY_LABELS, STATUS_LABELS, DealStatus } from '@/types/deals';
import { formatDistanceToNow } from 'date-fns';

const STATUS_ICONS: Record<DealStatus, typeof CheckCircle> = {
  new: Clock,
  in_review: FileText,
  analyzed: TrendingUp,
  approved: CheckCircle,
  declined: XCircle,
};

const STATUS_COLORS: Record<DealStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  analyzed: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
};

function RiskScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge variant="outline">Not analyzed</Badge>;
  
  let color = 'bg-green-100 text-green-800';
  if (score >= 70) color = 'bg-red-100 text-red-800';
  else if (score >= 40) color = 'bg-orange-100 text-orange-800';
  else if (score >= 20) color = 'bg-yellow-100 text-yellow-800';

  return (
    <Badge className={color}>
      Risk: {score}
    </Badge>
  );
}

function DealCard({ deal, onAnalyze }: { deal: Deal; onAnalyze: (id: string) => void }) {
  const navigate = useNavigate();
  const StatusIcon = STATUS_ICONS[deal.status];

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/deals/${deal.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-sm text-muted-foreground">{deal.deal_id}</span>
              <Badge className={STATUS_COLORS[deal.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {STATUS_LABELS[deal.status]}
              </Badge>
            </div>
            <h4 className="font-semibold truncate">{deal.title}</h4>
            {deal.client_name && (
              <p className="text-sm text-muted-foreground">{deal.client_name}</p>
            )}
            {deal.transaction_value && (
              <p className="text-sm font-medium text-primary">
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: deal.currency || 'GBP',
                  maximumFractionDigits: 0,
                }).format(deal.transaction_value)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <RiskScoreBadge score={deal.overall_risk_score} />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
            </span>
            {deal.status === 'new' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAnalyze(deal.id);
                }}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Analyze
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DealList() {
  const [activeCategory, setActiveCategory] = useState<DealCategory | 'all'>('all');
  const { data: deals, isLoading } = useDeals(activeCategory === 'all' ? undefined : activeCategory);
  const analyzeDocuments = useAnalyzeDocuments();

  const categories: Array<DealCategory | 'all'> = ['all', 'title', 'w_and_i', 'contingent_risk', 'tax', 'environmental'];

  const handleAnalyze = (dealId: string) => {
    analyzeDocuments.mutate(dealId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deals</span>
          <Badge variant="outline">{deals?.length || 0} total</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as DealCategory | 'all')}>
          <TabsList className="mb-4 flex-wrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.slice(1).map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {CATEGORY_LABELS[cat as DealCategory]}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading deals...</div>
              ) : deals?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No deals found. Sync your inbox to import new enquiries.
                </div>
              ) : (
                deals?.map((deal) => (
                  <DealCard 
                    key={deal.id} 
                    deal={deal} 
                    onAnalyze={handleAnalyze}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
