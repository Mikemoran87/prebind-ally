
-- Drop public "Anyone can view" policies
DROP POLICY IF EXISTS "Anyone can view deals" ON public.deals;
DROP POLICY IF EXISTS "Anyone can insert deals" ON public.deals;
DROP POLICY IF EXISTS "Anyone can view documents" ON public.documents;
DROP POLICY IF EXISTS "Anyone can view risk analysis" ON public.risk_analysis;
DROP POLICY IF EXISTS "Anyone can view reports" ON public.underwriting_reports;

-- Create authenticated-only policies for deals
CREATE POLICY "Authenticated users can view deals" ON public.deals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert deals" ON public.deals
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create authenticated-only policies for documents
CREATE POLICY "Authenticated users can view documents" ON public.documents
  FOR SELECT TO authenticated USING (true);

-- Create authenticated-only policies for risk_analysis
CREATE POLICY "Authenticated users can view risk analysis" ON public.risk_analysis
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert risk analysis" ON public.risk_analysis
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create authenticated-only policies for underwriting_reports
CREATE POLICY "Authenticated users can view reports" ON public.underwriting_reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert reports" ON public.underwriting_reports
  FOR INSERT TO authenticated WITH CHECK (true);
