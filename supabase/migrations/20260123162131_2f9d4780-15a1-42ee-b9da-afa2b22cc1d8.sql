-- Drop the restrictive SELECT policy and replace with a permissive one for viewing deals
DROP POLICY IF EXISTS "Authenticated users can view deals" ON public.deals;

CREATE POLICY "Anyone can view deals"
ON public.deals
FOR SELECT
USING (true);

-- Also update documents, risk_analysis, and underwriting_reports for demo access
DROP POLICY IF EXISTS "Authenticated users can view documents" ON public.documents;

CREATE POLICY "Anyone can view documents"
ON public.documents
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can view risk analysis" ON public.risk_analysis;

CREATE POLICY "Anyone can view risk analysis"
ON public.risk_analysis
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Authenticated users can view reports" ON public.underwriting_reports;

CREATE POLICY "Anyone can view reports"
ON public.underwriting_reports
FOR SELECT
USING (true);