export type DealCategory = 'title' | 'w_and_i' | 'contingent_risk' | 'tax' | 'environmental';
export type DealStatus = 'new' | 'in_review' | 'analyzed' | 'approved' | 'declined';
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Deal {
  id: string;
  deal_id: string;
  title: string;
  category: DealCategory;
  status: DealStatus;
  client_name: string | null;
  client_email: string | null;
  transaction_value: number | null;
  currency: string;
  summary: string | null;
  email_subject: string | null;
  email_received_at: string | null;
  email_message_id: string | null;
  overall_risk_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  deal_id: string;
  file_name: string;
  file_type: string;
  file_size: number | null;
  storage_path: string;
  mime_type: string | null;
  extracted_text: string | null;
  is_analyzed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RiskAnalysis {
  id: string;
  deal_id: string;
  document_id: string | null;
  risk_category: string;
  risk_title: string;
  risk_description: string;
  severity: RiskSeverity;
  source_excerpt: string | null;
  page_number: number | null;
  recommendation: string | null;
  is_material: boolean;
  created_at: string;
}

export interface UnderwritingReport {
  id: string;
  deal_id: string;
  report_type: string;
  executive_summary: string | null;
  risk_overview: any;
  key_findings: any;
  recommendations: any;
  coverage_analysis: any;
  exclusions_review: any;
  pricing_indicators: any;
  generated_at: string;
  is_final: boolean;
}

export const CATEGORY_LABELS: Record<DealCategory, string> = {
  title: 'Title',
  w_and_i: 'W&I',
  contingent_risk: 'Contingent Risk',
  tax: 'Tax',
  environmental: 'Environmental',
};

export const STATUS_LABELS: Record<DealStatus, string> = {
  new: 'New',
  in_review: 'In Review',
  analyzed: 'Analyzed',
  approved: 'Approved',
  declined: 'Declined',
};

export const SEVERITY_COLORS: Record<RiskSeverity, string> = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200',
};
