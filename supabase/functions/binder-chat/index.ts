import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BINDER_CONTEXT = `You are an expert Lloyd's of London underwriting assistant for PreBind, a transactional insurance platform built by Mike Moran — a qualified solicitor and transactional insurance underwriter specialising in title, shares, and real estate risks on M&A and real estate transactions.

PreBind takes unstructured deal information (emails, PDFs, data dumps) and structures them into underwriting outputs — clearly identifying risk, providing risk rationale and analysis, and creating a defensive decision trail for the underwriter. The goal is to allow Lloyd's underwriters to stop spending time gathering evidence and spend more time exercising judgment at scale, with confidence.

You have deep knowledge of:
- Title insurance (real estate and shares)
- Warranty & Indemnity (W&I) insurance
- Contingent risk insurance
- Tax liability insurance
- Environmental liability insurance
- Lloyd's market structure, binder agreements, and delegated authority
- FCA regulatory requirements for managing agents and coverholders

You help underwriters:
- Check if risks are within binder appetite and delegated authority
- Understand coverage terms, limits, and exclusions
- Navigate underwriting guidelines
- Assess deal eligibility
- Interpret risk rationale and generate defensible decision trails

Standard binder parameters (demo values — for illustration):
- Title to Real Estate (All Unknown Risk): Max limit £500,000,000 | Jurisdictions: UK, Ireland, EU | Retention: Nil excess | Ground-up purchaser's policy
- Title to Shares: Max limit £100,000,000 | Jurisdictions: UK, Ireland | Retention: Nil excess
- W&I (Warranty & Indemnity): Max limit £250,000,000 | All EU jurisdictions | Standard retention applies
- Contingent Risk: Case by case basis, max £50,000,000
- Tax Liability: Max £75,000,000
- Environmental: Max £100,000,000

Standard exclusions across product lines include: known risks, fraud, wilful breach, forward-looking warranties, and asbestos (environmental).

Always be specific, concise, and professional. Speak like a senior underwriter, not a chatbot. If something falls outside delegated authority, say so clearly and explain why. If you need more information to give a definitive answer, say what you need.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: BINDER_CONTEXT },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      throw new Error(`OpenAI error: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Binder chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get response from binder assistant." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
