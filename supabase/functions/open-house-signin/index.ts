import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const {
      slug,
      first_name,
      last_name,
      email,
      phone,
      working_with_agent,
      agent_name,
      how_heard,
      notes,
    } = await req.json();

    if (!slug || !first_name || !last_name || !email) {
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

    // Look up open house by slug
    const { data: openHouse, error: ohError } = await supabase
      .from("open_houses")
      .select("id, property_address, status")
      .eq("slug", slug)
      .single();

    if (ohError || !openHouse) {
      return new Response(
        JSON.stringify({ error: "Open house not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (openHouse.status === "completed") {
      return new Response(
        JSON.stringify({ error: "This open house has ended" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Upsert client by email
    const normalizedEmail = email.toLowerCase().trim();
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    let clientId: string;

    if (existingClient) {
      clientId = existingClient.id;
      // Update name/phone if provided
      const updates: Record<string, string> = {};
      if (first_name) updates.first_name = first_name;
      if (last_name) updates.last_name = last_name;
      if (phone) updates.phone = phone;
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
          email: normalizedEmail,
          phone: phone || null,
        })
        .select("id")
        .single();
      if (clientError) throw clientError;
      clientId = newClient.id;

      // Auto-tag as "Prospect"
      const { data: prospectTag } = await supabase
        .from("tags")
        .select("id")
        .eq("name", "Prospect")
        .single();
      if (prospectTag) {
        await supabase
          .from("client_tags")
          .insert({ client_id: clientId, tag_id: prospectTag.id });
      }
    }

    // Create visitor record
    await supabase.from("open_house_visitors").insert({
      open_house_id: openHouse.id,
      client_id: clientId,
      first_name,
      last_name,
      email: normalizedEmail,
      phone: phone || null,
      working_with_agent: working_with_agent || false,
      agent_name: agent_name || null,
      how_heard: how_heard || null,
      notes: notes || null,
    });

    // Create interaction record
    await supabase.from("interactions").insert({
      client_id: clientId,
      interaction_type: "showing",
      notes: `Attended open house at ${openHouse.property_address}`,
      interaction_date: new Date().toISOString(),
    });

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
