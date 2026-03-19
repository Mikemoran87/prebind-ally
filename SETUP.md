# PreBind Ally — Setup Guide

This guide walks you through making PreBind Ally fully functional with real AI.

---

## Step 1 — Add OpenAI API Key to Supabase

The AI features (document analysis, binder chat) need your OpenAI API key added to Supabase as a secret.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your PreBind project
3. In the left sidebar, go to **Edge Functions**
4. Click **Secrets** (top right of the Edge Functions page)
5. Click **Add new secret**
6. Name: `OPENAI_API_KEY`
7. Value: your OpenAI API key (starts with `sk-proj-...`)
8. Click **Save**

---

## Step 2 — Create the Storage Bucket

Documents need a place to live in Supabase Storage.

1. In your Supabase project, go to **Storage** in the left sidebar
2. Click **New bucket**
3. Name it exactly: `deal-documents`
4. Set it to **Private** (the Edge Functions access it via service role)
5. Click **Save**

---

## Step 3 — Deploy the Edge Functions

Three Edge Functions need to be deployed:
- `analyze-documents` — AI risk analysis of uploaded documents
- `binder-chat` — Live AI binder assistant chat
- `process-outlook-emails` — Email sync (optional, requires Microsoft 365)

### Option A — Via Supabase CLI (recommended)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login
supabase login

# Link to your project (get project ref from Supabase dashboard URL)
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy analyze-documents
supabase functions deploy binder-chat
supabase functions deploy process-outlook-emails
```

### Option B — Via Supabase Dashboard

1. Go to **Edge Functions** in your Supabase project
2. For each function, click **Deploy new function**
3. Copy the code from the `supabase/functions/` folder

---

## Step 4 — Email Sync (Optional)

To enable automatic email intake from Outlook, you need Microsoft 365 credentials:

Add these secrets to Supabase (same as Step 1):
- `MICROSOFT_TENANT_ID`
- `MICROSOFT_CLIENT_ID`  
- `MICROSOFT_CLIENT_SECRET`

Get these from [Azure App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).

---

## What Works After Setup

| Feature | Status |
|---------|--------|
| Upload documents to Supabase Storage | ✅ |
| AI document risk analysis (GPT-4o) | ✅ |
| Auto-generated underwriting reports | ✅ |
| Binder chat assistant (GPT-4o mini) | ✅ |
| Email intake from Outlook | ✅ (requires MS365 credentials) |
| Deal management & audit trail | ✅ |

---

## Estimated Costs

- Document analysis (5 docs per deal): ~$0.50–$2.00 per deal
- Binder chat: ~$0.01–$0.05 per conversation
- $20 OpenAI credit covers extensive prototype usage

---

*Built by Henry (AI assistant) for Mike Moran, PreBind founder.*
