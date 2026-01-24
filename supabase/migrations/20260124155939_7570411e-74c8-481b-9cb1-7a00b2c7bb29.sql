-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert deals" ON public.deals;

-- Create a permissive INSERT policy that allows anyone to insert
CREATE POLICY "Anyone can insert deals"
ON public.deals
FOR INSERT
WITH CHECK (true);