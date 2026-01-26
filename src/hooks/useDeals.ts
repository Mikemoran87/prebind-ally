import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal, DealCategory, Document, RiskAnalysis, UnderwritingReport } from '@/types/deals';
import { toast } from 'sonner';

export function useDeals(category?: DealCategory) {
  return useQuery({
    queryKey: ['deals', category],
    queryFn: async () => {
      let query = supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      return data as Deal[];
    },
  });
}

export function useDeal(dealId: string | undefined) {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => {
      if (!dealId) return null;

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .single();

      if (error) {
        console.error('Error fetching deal:', error);
        throw error;
      }

      return data as Deal;
    },
    enabled: !!dealId,
  });
}

export function useDealDocuments(dealId: string | undefined) {
  return useQuery({
    queryKey: ['deal-documents', dealId],
    queryFn: async () => {
      if (!dealId) return [];

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('deal_id', dealId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      return data as Document[];
    },
    enabled: !!dealId,
  });
}

export function useDealRisks(dealId: string | undefined) {
  return useQuery({
    queryKey: ['deal-risks', dealId],
    queryFn: async () => {
      if (!dealId) return [];

      const { data, error } = await supabase
        .from('risk_analysis')
        .select('*')
        .eq('deal_id', dealId)
        .order('severity', { ascending: false });

      if (error) {
        console.error('Error fetching risks:', error);
        throw error;
      }

      return data as RiskAnalysis[];
    },
    enabled: !!dealId,
  });
}

export function useDealReport(dealId: string | undefined) {
  return useQuery({
    queryKey: ['deal-report', dealId],
    queryFn: async () => {
      if (!dealId) return null;

      const { data, error } = await supabase
        .from('underwriting_reports')
        .select('*')
        .eq('deal_id', dealId)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching report:', error);
        throw error;
      }

      return data as UnderwritingReport | null;
    },
    enabled: !!dealId,
  });
}

export function useSyncEmails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mailboxId: string) => {
      const { data, error } = await supabase.functions.invoke('process-outlook-emails', {
        body: { mailboxId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success(`Processed ${data.processedCount} new emails`);
    },
    onError: (error) => {
      console.error('Error syncing emails:', error);
      toast.error('Failed to sync emails');
    },
  });
}

export function useAnalyzeDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      // Shorter simulated analysis time for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the deal's risk score to 32%
      await supabase
        .from('deals')
        .update({ overall_risk_score: 32 })
        .eq('id', dealId);
      
      return { risksFound: 2 };
    },
    onSuccess: (data, dealId) => {
      queryClient.invalidateQueries({ queryKey: ['deal', dealId] });
      queryClient.invalidateQueries({ queryKey: ['deal-risks', dealId] });
      queryClient.invalidateQueries({ queryKey: ['deal-report', dealId] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Two risks identified', {
        description: '1. Absence of Easement Risk\n2. Adverse Possession Risk',
      });
    },
    onError: (error) => {
      console.error('Error analyzing documents:', error);
      toast.error('Failed to analyze documents');
    },
  });
}
