import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

async function sha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { chat_id } = await req.json();
    if (!chat_id) {
      return new Response(JSON.stringify({ error: "invalid_request", message: "chat_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Verify caller is in chat
    const { data: chat, error: chatErr } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chat_id)
      .single();

    if (chatErr || !chat) {
      return new Response(JSON.stringify({ error: "chat_not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (chat.user_a !== user.id && chat.user_b !== user.id) {
      return new Response(JSON.stringify({ error: "not_member", message: "You are not a member of this chat." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Verify chat is locked
    if (chat.message_count < chat.message_cap) {
      return new Response(
        JSON.stringify({
          error: "not_locked",
          message: `Chat is not locked yet (${chat.message_count}/${chat.message_cap}).`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Rate limiting: max 5 tokens per chat per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from("meetup_tokens")
      .select("*", { count: "exact", head: true })
      .eq("chat_id", chat_id)
      .gte("expires_at", oneHourAgo);

    if (count && count >= 5) {
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          message: "Too many codes generated recently. Please wait before trying again.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Generate random secure 6-digit code
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const code = (100000 + (randomArray[0] % 900000)).toString();

    // 5. Hash token with salt: sha256(code || chat_id)
    const tokenHash = await sha256(code + chat_id);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    const { error: insertErr } = await supabase.from("meetup_tokens").insert({
      chat_id,
      created_by: user.id,
      token_hash: tokenHash,
      attempts: 0,
      expires_at: expiresAt,
    });

    if (insertErr) {
      return new Response(JSON.stringify({ error: "insert_failed", message: insertErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        code,
        expires_at: expiresAt,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("create-meetup-token error:", err);
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
