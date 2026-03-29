import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RiskFinding {
  risk_category: string;
  risk_title: string;
  risk_description: string;
  severity: "low" | "medium" | "high" | "critical";
  source_excerpt?: string;
  page_number?: number;
  recommendation?: string;
  is_material: boolean;
}

// Product-specific risk analysis prompts
const PRODUCT_PROMPTS: Record<string, string> = {
  title: `You are an expert Title Insurance underwriter. Analyze the document for:
- Liens, encumbrances, and title defects
- Easements and rights of way issues
- Survey discrepancies and boundary disputes
- Prior ownership chain breaks
- Judgment liens and tax liens
- Mechanic's liens
- Pending litigation affecting title
- Zoning violations
- Environmental restrictions on title`,

  w_and_i: `You are an expert Warranty & Indemnity (W&I/Rep & Warranty) Insurance underwriter. Analyze the document for:
- Financial statement warranties and accuracy concerns
- Material contracts and change of control provisions
- Employee benefit and pension liabilities
- Tax warranty exposures
- Environmental representations
- IP ownership and licensing issues
- Customer/supplier concentration risks
- Undisclosed liabilities
- Related party transactions
- Compliance with laws representations`,

  contingent_risk: `You are an expert Contingent Risk Insurance underwriter. Analyze the document for:
- Pending or threatened litigation details
- Probability of adverse outcomes
- Quantum of potential liability
- Insurance coverage gaps
- Indemnification obligations
- Successor liability concerns
- Tax authority disputes
- Regulatory investigations
- Product liability exposures
- Historical claims patterns`,

  tax: `You are an expert Tax Liability Insurance underwriter. Analyze the document for:
- Tax structure complexity and aggressiveness
- Transfer pricing arrangements
- Permanent establishment risks
- Withholding tax exposures
- Tax loss carryforward validity
- R&D tax credit substantiation
- Sales/use tax nexus issues
- State tax apportionment
- International tax treaty positions
- Tax authority challenge history`,

  environmental: `You are an expert Environmental Liability Insurance underwriter. Analyze the document for:
- Known contamination sites
- Historical industrial uses
- Underground storage tanks
- Asbestos-containing materials
- Lead paint concerns
- PCB contamination
- PFAS/emerging contaminants
- Regulatory compliance status
- Remediation cost estimates
- Third-party liability exposures
- Natural resource damages`,
};

async function extractTextFromDocument(supabase: any, document: any): Promise<string> {
  // For now, return placeholder - in production, integrate with a document parsing service
  // like Adobe PDF Services, Google Document AI, or similar
  console.log(`Extracting text from: ${document.file_name}`);
  
  // If we already have extracted text, use it
  if (document.extracted_text) {
    return document.extracted_text;
  }
  
  // Download the document
  const { data, error } = await supabase.storage
    .from("deal-documents")
    .download(document.storage_path);
  
  if (error) {
    console.error("Error downloading document:", error);
    return "";
  }

  // For text-based files, extract content directly
  if (document.mime_type?.includes("text") || document.file_name.endsWith(".txt")) {
    return await data.text();
  }

  // For PDFs — extract text using OpenAI's vision/file capabilities via base64
  if (document.mime_type === "application/pdf" || document.file_name.toLowerCase().endsWith(".pdf")) {
    try {
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_API_KEY) return "";

      // Convert blob to base64
      const arrayBuffer = await data.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);

      // Use OpenAI to extract text from PDF via base64 encoded file
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all text content from this PDF document. Return the complete text verbatim, preserving structure and formatting as much as possible. Do not summarise — return the full text.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:application/pdf;base64,${base64}`,
                    detail: "high",
                  },
                },
              ],
            },
          ],
          max_tokens: 4000,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const extractedText = result.choices?.[0]?.message?.content || "";
        if (extractedText) {
          console.log(`Extracted ${extractedText.length} chars from PDF: ${document.file_name}`);
          return extractedText;
        }
      } else {
        console.error("PDF extraction failed:", await response.text());
      }
    } catch (err) {
      console.error("PDF extraction error:", err);
    }
  }

  // For Word/Excel — extract as best we can
  if (document.file_name.match(/\.(docx?|xlsx?)$/i)) {
    try {
      return await data.text();
    } catch {
      return `[Document: ${document.file_name} — Word/Excel extraction not yet supported. Please upload as PDF or TXT.]`;
    }
  }

  return `[Document: ${document.file_name} — could not extract text. Try uploading as a .txt or .pdf file.]`;
}

async function analyzeDocumentWithAI(
  documentText: string,
  documentName: string,
  dealCategory: string,
  dealContext: string
): Promise<RiskFinding[]> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured");
    return [];
  }

  const productPrompt = PRODUCT_PROMPTS[dealCategory] || PRODUCT_PROMPTS.w_and_i;

  const systemPrompt = `${productPrompt}

Analyze the following document and identify ALL material risks that could affect the underwriting decision.

For each risk found, provide:
1. risk_category: A category name (e.g., "Financial", "Legal", "Environmental", "Tax", "Operational")
2. risk_title: A brief title for the risk
3. risk_description: Detailed description of the risk
4. severity: One of "low", "medium", "high", or "critical"
5. source_excerpt: The relevant quote from the document
6. recommendation: Suggested action or mitigation
7. is_material: Whether this is a material risk that could significantly impact the transaction

Respond with a JSON array of risk findings:
{
  "risks": [
    {
      "risk_category": "Financial",
      "risk_title": "Revenue Recognition Concerns",
      "risk_description": "Detailed description...",
      "severity": "high",
      "source_excerpt": "Quote from document...",
      "recommendation": "Request audited financials...",
      "is_material": true
    }
  ]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Deal Context: ${dealContext}\n\nDocument Name: ${documentName}\n\nDocument Content:\n${documentText.substring(0, 30000)}`,
          },
        ],

      }),
    });

    if (!response.ok) {
      console.error("AI analysis failed:", await response.text());
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      const parsed = JSON.parse(content);
      return parsed.risks || [];
    }
  } catch (error) {
    console.error("Error analyzing document:", error);
  }

  return [];
}

async function generateUnderwritingReport(
  supabase: any,
  dealId: string,
  deal: any,
  risks: RiskFinding[]
): Promise<void> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  if (!OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not configured");
    return;
  }

  const productPrompt = PRODUCT_PROMPTS[deal.category] || PRODUCT_PROMPTS.w_and_i;

  const systemPrompt = `${productPrompt}

Based on the risk analysis findings, generate a comprehensive underwriting report with the following sections:

1. executive_summary: A concise summary of the deal and key risks (2-3 paragraphs)
2. risk_overview: Summary of risks by category and severity
3. key_findings: Top 5-7 most significant findings
4. recommendations: Specific underwriting recommendations
5. coverage_analysis: Suggested coverage structure and limits
6. exclusions_review: Recommended exclusions based on risks found
7. pricing_indicators: Risk factors that should influence pricing

Respond in JSON format:
{
  "executive_summary": "...",
  "risk_overview": {
    "total_risks": 10,
    "critical": 1,
    "high": 3,
    "medium": 4,
    "low": 2,
    "by_category": [{"category": "Financial", "count": 3}]
  },
  "key_findings": [{"title": "...", "description": "...", "severity": "high"}],
  "recommendations": [{"action": "...", "priority": "high", "rationale": "..."}],
  "coverage_analysis": {"suggested_limit": "...", "retention": "...", "structure": "..."},
  "exclusions_review": [{"exclusion": "...", "reason": "..."}],
  "pricing_indicators": {"base_rate_adjustment": "...", "risk_factors": [...]}
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Deal: ${deal.title}\nCategory: ${deal.category}\nClient: ${deal.client_name}\nTransaction Value: ${deal.transaction_value || "Not specified"}\n\nRisk Findings:\n${JSON.stringify(risks, null, 2)}`,
          },
        ],

      }),
    });

    if (!response.ok) {
      console.error("Report generation failed:", await response.text());
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      const report = JSON.parse(content);

      await supabase.from("underwriting_reports").insert({
        deal_id: dealId,
        report_type: "summary",
        executive_summary: report.executive_summary,
        risk_overview: report.risk_overview,
        key_findings: report.key_findings,
        recommendations: report.recommendations,
        coverage_analysis: report.coverage_analysis,
        exclusions_review: report.exclusions_review,
        pricing_indicators: report.pricing_indicators,
      });

      console.log("Generated underwriting report");
    }
  } catch (error) {
    console.error("Error generating report:", error);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dealId } = await req.json();

    if (!dealId) {
      return new Response(
        JSON.stringify({ error: "dealId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing documents for deal: ${dealId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the deal
    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .select("*")
      .eq("id", dealId)
      .single();

    if (dealError || !deal) {
      return new Response(
        JSON.stringify({ error: "Deal not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all documents for the deal
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .eq("deal_id", dealId)
      .eq("is_analyzed", false);

    if (docsError) {
      console.error("Error fetching documents:", docsError);
      return new Response(
        JSON.stringify({ error: "Error fetching documents" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${documents?.length || 0} documents to analyze`);

    const allRisks: RiskFinding[] = [];

    // Analyze each document
    for (const doc of documents || []) {
      console.log(`Analyzing document: ${doc.file_name}`);

      // Extract text from document
      const documentText = await extractTextFromDocument(supabase, doc);

      if (!documentText) {
        console.log(`No text extracted from ${doc.file_name}`);
        continue;
      }

      // Store extracted text
      await supabase
        .from("documents")
        .update({ extracted_text: documentText.substring(0, 50000) })
        .eq("id", doc.id);

      // Analyze with AI
      const dealContext = `${deal.title} - ${deal.summary || "No summary available"}`;
      const risks = await analyzeDocumentWithAI(
        documentText,
        doc.file_name,
        deal.category,
        dealContext
      );

      console.log(`Found ${risks.length} risks in ${doc.file_name}`);

      // Store risk findings
      for (const risk of risks) {
        const { error: riskError } = await supabase.from("risk_analysis").insert({
          deal_id: dealId,
          document_id: doc.id,
          risk_category: risk.risk_category,
          risk_title: risk.risk_title,
          risk_description: risk.risk_description,
          severity: risk.severity,
          source_excerpt: risk.source_excerpt,
          recommendation: risk.recommendation,
          is_material: risk.is_material,
        });

        if (riskError) {
          console.error("Error storing risk:", riskError);
        }

        allRisks.push(risk);
      }

      // Mark document as analyzed
      await supabase
        .from("documents")
        .update({ is_analyzed: true })
        .eq("id", doc.id);
    }

    // Calculate overall risk score
    const riskScore = allRisks.reduce((score, risk) => {
      const weights = { critical: 40, high: 20, medium: 10, low: 5 };
      return score + (weights[risk.severity] || 0);
    }, 0);

    const normalizedScore = Math.min(100, riskScore);

    // Update deal with risk score and status
    await supabase
      .from("deals")
      .update({
        overall_risk_score: normalizedScore,
        status: "analyzed",
      })
      .eq("id", dealId);

    // Generate underwriting report
    await generateUnderwritingReport(supabase, dealId, deal, allRisks);

    return new Response(
      JSON.stringify({
        success: true,
        dealId: deal.deal_id,
        risksFound: allRisks.length,
        riskScore: normalizedScore,
        materialRisks: allRisks.filter(r => r.is_material).length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error analyzing documents:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
