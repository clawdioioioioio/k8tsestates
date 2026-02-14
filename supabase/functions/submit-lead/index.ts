import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { first_name, last_name, email, phone, interest_type, message } =
      await req.json();

    // Validate required fields
    if (!first_name || !last_name || !email || !interest_type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Check if client with this email already exists
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id, first_name, last_name, phone")
      .eq("email", email.toLowerCase().trim())
      .single();

    let clientId: string;

    if (existingClient) {
      clientId = existingClient.id;
      // Update name/phone if different
      const updates: Record<string, string> = {};
      if (existingClient.first_name !== first_name) updates.first_name = first_name;
      if (existingClient.last_name !== last_name) updates.last_name = last_name;
      if (phone && existingClient.phone !== phone) updates.phone = phone;
      if (Object.keys(updates).length > 0) {
        await supabase.from("clients").update(updates).eq("id", clientId);
      }
    } else {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from("clients")
        .insert({
          first_name,
          last_name,
          email: email.toLowerCase().trim(),
          phone,
        })
        .select("id")
        .single();
      if (clientError) throw clientError;
      clientId = newClient.id;
    }

    // Create inquiry
    const { error: inquiryError } = await supabase.from("inquiries").insert({
      client_id: clientId,
      interest_type,
      message,
    });
    if (inquiryError) throw inquiryError;

    // Send email notification via Resend
    try {
      const isReturning = !!existingClient;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "K8ts Estates <leads@k8tsestates.com>",
          to: "kminovski@gmail.com",
          subject: `${isReturning ? "Returning" : "New"} Inquiry: ${first_name} ${last_name}`,
          html: `
            <h2>${isReturning ? "Returning Client" : "New Contact Form Submission"}</h2>
            <p><strong>Name:</strong> ${first_name} ${last_name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Interest:</strong> ${interest_type}</p>
            <p><strong>Message:</strong> ${message || "None"}</p>
            ${isReturning ? "<p><em>This client has submitted inquiries before.</em></p>" : ""}
          `,
        }),
      });
    } catch {
      console.error("Failed to send email notification");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
