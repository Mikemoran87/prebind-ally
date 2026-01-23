-- Create enum for deal product categories
CREATE TYPE public.deal_category AS ENUM ('title', 'w_and_i', 'contingent_risk', 'tax', 'environmental');

-- Create enum for deal status
CREATE TYPE public.deal_status AS ENUM ('new', 'in_review', 'analyzed', 'approved', 'declined');

-- Create enum for risk severity
CREATE TYPE public.risk_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create deals table to store incoming insurance enquiries
CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category deal_category NOT NULL,
    status deal_status NOT NULL DEFAULT 'new',
    client_name TEXT,
    client_email TEXT,
    transaction_value NUMERIC,
    currency TEXT DEFAULT 'USD',
    summary TEXT,
    email_subject TEXT,
    email_received_at TIMESTAMP WITH TIME ZONE,
    email_message_id TEXT,
    overall_risk_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table to store deal attachments
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    storage_path TEXT NOT NULL,
    mime_type TEXT,
    extracted_text TEXT,
    is_analyzed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_analysis table to store AI-identified risks
CREATE TABLE public.risk_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    risk_category TEXT NOT NULL,
    risk_title TEXT NOT NULL,
    risk_description TEXT NOT NULL,
    severity risk_severity NOT NULL,
    source_excerpt TEXT,
    page_number INTEGER,
    recommendation TEXT,
    is_material BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create underwriting_reports table for structured output
CREATE TABLE public.underwriting_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL DEFAULT 'summary',
    executive_summary TEXT,
    risk_overview JSONB,
    key_findings JSONB,
    recommendations JSONB,
    coverage_analysis JSONB,
    exclusions_review JSONB,
    pricing_indicators JSONB,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_final BOOLEAN DEFAULT false
);

-- Create email_sync_state table to track processed emails
CREATE TABLE public.email_sync_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mailbox_id TEXT NOT NULL,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_message_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.underwriting_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sync_state ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deals (authenticated users can access all for now)
CREATE POLICY "Authenticated users can view deals"
    ON public.deals FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert deals"
    ON public.deals FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update deals"
    ON public.deals FOR UPDATE
    TO authenticated
    USING (true);

-- Allow service role full access (for edge functions)
CREATE POLICY "Service role has full access to deals"
    ON public.deals FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for documents
CREATE POLICY "Authenticated users can view documents"
    ON public.documents FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert documents"
    ON public.documents FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Service role has full access to documents"
    ON public.documents FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for risk_analysis
CREATE POLICY "Authenticated users can view risk analysis"
    ON public.risk_analysis FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to risk analysis"
    ON public.risk_analysis FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for underwriting_reports
CREATE POLICY "Authenticated users can view reports"
    ON public.underwriting_reports FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Service role has full access to reports"
    ON public.underwriting_reports FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for email_sync_state
CREATE POLICY "Service role has full access to email sync"
    ON public.email_sync_state FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_deals_category ON public.deals(category);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deals_created_at ON public.deals(created_at DESC);
CREATE INDEX idx_documents_deal_id ON public.documents(deal_id);
CREATE INDEX idx_risk_analysis_deal_id ON public.risk_analysis(deal_id);
CREATE INDEX idx_risk_analysis_severity ON public.risk_analysis(severity);
CREATE INDEX idx_underwriting_reports_deal_id ON public.underwriting_reports(deal_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON public.deals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_sync_updated_at
    BEFORE UPDATE ON public.email_sync_state
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for deal documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('deal-documents', 'deal-documents', false);

-- Create storage policies for deal documents bucket
CREATE POLICY "Authenticated users can view deal documents"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'deal-documents');

CREATE POLICY "Authenticated users can upload deal documents"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'deal-documents');

CREATE POLICY "Service role has full access to deal documents"
    ON storage.objects FOR ALL
    TO service_role
    USING (bucket_id = 'deal-documents')
    WITH CHECK (bucket_id = 'deal-documents');