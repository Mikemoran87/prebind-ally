-- Add review_status column to documents table for tracking analysis results
ALTER TABLE public.documents 
ADD COLUMN review_status TEXT CHECK (review_status IN ('clean', 'compliant', 'flagged', 'pending'));