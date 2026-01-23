import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailAttachment {
  id: string;
  name: string;
  contentType: string;
  size: number;
  contentBytes?: string;
}

interface EmailMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  body: { content: string; contentType: string };
  from: { emailAddress: { address: string; name: string } };
  receivedDateTime: string;
  hasAttachments: boolean;
}

// Get Microsoft Graph access token using client credentials
async function getAccessToken(): Promise<string> {
  const tenantId = Deno.env.get("MICROSOFT_TENANT_ID");
  const clientId = Deno.env.get("MICROSOFT_CLIENT_ID");
  const clientSecret = Deno.env.get("MICROSOFT_CLIENT_SECRET");

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Microsoft Graph credentials not configured");
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to get access token:", error);
    throw new Error("Failed to authenticate with Microsoft Graph");
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch emails from Outlook inbox
async function fetchEmails(accessToken: string, mailboxId: string): Promise<EmailMessage[]> {
  const url = `https://graph.microsoft.com/v1.0/users/${mailboxId}/messages?$top=10&$orderby=receivedDateTime desc&$filter=isRead eq false`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to fetch emails:", error);
    throw new Error("Failed to fetch emails from Outlook");
  }

  const data = await response.json();
  return data.value || [];
}

// Fetch attachments for an email
async function fetchAttachments(accessToken: string, mailboxId: string, messageId: string): Promise<EmailAttachment[]> {
  const url = `https://graph.microsoft.com/v1.0/users/${mailboxId}/messages/${messageId}/attachments`;
  
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("Failed to fetch attachments");
    return [];
  }

  const data = await response.json();
  return data.value || [];
}

// Mark email as read
async function markAsRead(accessToken: string, mailboxId: string, messageId: string): Promise<void> {
  const url = `https://graph.microsoft.com/v1.0/users/${mailboxId}/messages/${messageId}`;
  
  await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isRead: true }),
  });
}

// Classify email into product category using AI
async function classifyDeal(emailSubject: string, emailBody: string): Promise<{ category: string; summary: string; clientName: string; transactionValue: number | null }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.log("LOVABLE_API_KEY not set, using default classification");
    return { category: "w_and_i", summary: emailBody.substring(0, 500), clientName: "", transactionValue: null };
  }

  const systemPrompt = `You are an expert insurance underwriter assistant. Analyze the email and extract:
1. Product category (MUST be one of: title, w_and_i, contingent_risk, tax, environmental)
2. A brief summary of the transaction/enquiry
3. Client/company name if mentioned
4. Transaction value if mentioned

Categories explained:
- title: Title insurance for real estate transactions
- w_and_i: Warranty & Indemnity (M&A) insurance
- contingent_risk: Contingent liability, litigation buyout, tax indemnity
- tax: Tax liability insurance
- environmental: Environmental liability insurance

Respond in JSON format:
{
  "category": "w_and_i",
  "summary": "Brief description",
  "clientName": "Company Name",
  "transactionValue": 50000000
}`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Subject: ${emailSubject}\n\nBody:\n${emailBody}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("AI classification failed:", await response.text());
      return { category: "w_and_i", summary: emailBody.substring(0, 500), clientName: "", transactionValue: null };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (content) {
      const parsed = JSON.parse(content);
      return {
        category: parsed.category || "w_and_i",
        summary: parsed.summary || emailBody.substring(0, 500),
        clientName: parsed.clientName || "",
        transactionValue: parsed.transactionValue || null,
      };
    }
  } catch (error) {
    console.error("Error classifying deal:", error);
  }

  return { category: "w_and_i", summary: emailBody.substring(0, 500), clientName: "", transactionValue: null };
}

// Generate deal ID
function generateDealId(category: string): string {
  const prefixes: Record<string, string> = {
    title: "TI",
    w_and_i: "WI",
    contingent_risk: "CR",
    tax: "TX",
    environmental: "EV",
  };
  const prefix = prefixes[category] || "GN";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${year}-${random}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mailboxId } = await req.json();
    
    if (!mailboxId) {
      return new Response(
        JSON.stringify({ error: "mailboxId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing emails for mailbox: ${mailboxId}`);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get access token
    const accessToken = await getAccessToken();
    console.log("Got Microsoft Graph access token");

    // Fetch unread emails
    const emails = await fetchEmails(accessToken, mailboxId);
    console.log(`Found ${emails.length} unread emails`);

    const processedDeals: any[] = [];

    for (const email of emails) {
      console.log(`Processing email: ${email.subject}`);

      // Check if email already processed
      const { data: existingDeal } = await supabase
        .from("deals")
        .select("id")
        .eq("email_message_id", email.id)
        .single();

      if (existingDeal) {
        console.log("Email already processed, skipping");
        continue;
      }

      // Classify the deal
      const classification = await classifyDeal(email.subject, email.bodyPreview);
      console.log(`Classified as: ${classification.category}`);

      // Generate deal ID
      const dealId = generateDealId(classification.category);

      // Create the deal
      const { data: deal, error: dealError } = await supabase
        .from("deals")
        .insert({
          deal_id: dealId,
          title: email.subject,
          category: classification.category,
          status: "new",
          client_name: classification.clientName || email.from.emailAddress.name,
          client_email: email.from.emailAddress.address,
          transaction_value: classification.transactionValue,
          summary: classification.summary,
          email_subject: email.subject,
          email_received_at: email.receivedDateTime,
          email_message_id: email.id,
        })
        .select()
        .single();

      if (dealError) {
        console.error("Error creating deal:", dealError);
        continue;
      }

      console.log(`Created deal: ${dealId}`);

      // Process attachments if any
      if (email.hasAttachments) {
        const attachments = await fetchAttachments(accessToken, mailboxId, email.id);
        console.log(`Found ${attachments.length} attachments`);

        for (const attachment of attachments) {
          if (!attachment.contentBytes) continue;

          // Decode base64 content
          const fileContent = Uint8Array.from(atob(attachment.contentBytes), c => c.charCodeAt(0));
          
          // Upload to storage
          const storagePath = `${deal.id}/${attachment.name}`;
          const { error: uploadError } = await supabase.storage
            .from("deal-documents")
            .upload(storagePath, fileContent, {
              contentType: attachment.contentType,
              upsert: true,
            });

          if (uploadError) {
            console.error("Error uploading attachment:", uploadError);
            continue;
          }

          // Create document record
          const { error: docError } = await supabase
            .from("documents")
            .insert({
              deal_id: deal.id,
              file_name: attachment.name,
              file_type: attachment.contentType.split("/")[1] || "unknown",
              file_size: attachment.size,
              storage_path: storagePath,
              mime_type: attachment.contentType,
            });

          if (docError) {
            console.error("Error creating document record:", docError);
          }

          console.log(`Uploaded document: ${attachment.name}`);
        }
      }

      // Mark email as read
      await markAsRead(accessToken, mailboxId, email.id);

      processedDeals.push({
        dealId: deal.deal_id,
        category: classification.category,
        attachmentCount: email.hasAttachments ? (await fetchAttachments(accessToken, mailboxId, email.id)).length : 0,
      });
    }

    // Update sync state
    await supabase
      .from("email_sync_state")
      .upsert({
        mailbox_id: mailboxId,
        last_sync_at: new Date().toISOString(),
        last_message_id: emails[0]?.id,
      }, { onConflict: "mailbox_id" });

    return new Response(
      JSON.stringify({
        success: true,
        processedCount: processedDeals.length,
        deals: processedDeals,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing emails:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
