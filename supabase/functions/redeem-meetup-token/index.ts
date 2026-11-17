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

    const { code } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return new Response(JSON.stringify({ error: "invalid_code", message: "6-digit code required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanCode = code.trim();

    // Fetch active chats where current user is a member
    const { data: userChats, error: chatsErr } = await supabase
      .from("chats")
      .select("id, user_a, user_b, message_cap")
      .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);

    if (chatsErr || !userChats || userChats.length === 0) {
      return new Response(JSON.stringify({ error: "invalid_code", message: "No matching chat found." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check potential token hashes for each chat user is a member of
    let matchedToken: any = null;
    let matchedChat: any = null;

    for (const chat of userChats) {
      const candidateHash = await sha256(cleanCode + chat.id);
      const { data: tok } = await supabase
        .from("meetup_tokens")
        .select("*")
        .eq("chat_id", chat.id)
        .eq("token_hash", candidateHash)
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (tok) {
        matchedToken = tok;
        matchedChat = chat;
        break;
      }
    }

    if (!matchedToken) {
      return new Response(JSON.stringify({ error: "invalid_code", message: "The code you entered is invalid." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Check attempt throttling (max 5 attempts)
    if (matchedToken.attempts >= 5) {
      return new Response(
        JSON.stringify({
          error: "too_many_attempts",
          message: "Too many failed attempts. This code is locked.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Prevent self-redemption
    if (matchedToken.created_by === user.id) {
      return new Response(
        JSON.stringify({
          error: "self_redeem",
          message: "You cannot redeem your own meetup code. Your friend must enter it.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Check already used
    if (matchedToken.used_at) {
      return new Response(
        JSON.stringify({
          error: "already_used",
          message: "This code has already been redeemed.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 4. Check expired
    if (new Date(matchedToken.expires_at).getTime() < Date.now()) {
      return new Response(
        JSON.stringify({
          error: "expired",
          message: "This code has expired (5-minute limit).",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. SUCCESS: Atomic execution
    const nowIso = new Date().toISOString();
    const newCap = (matchedChat.message_cap || 20) + 20;

    // Mark token used
    await supabase
      .from("meetup_tokens")
      .update({ used_at: nowIso, used_by: user.id })
      .eq("id", matchedToken.id);

    // Update chat message_cap
    await supabase
      .from("chats")
      .update({ message_cap: newCap })
      .eq("id", matchedChat.id);

    // Insert meetup row
    await supabase
      .from("meetups")
      .insert({ chat_id: matchedChat.id, met_at: nowIso });

    // Insert Meetup Stamp for both users
    await supabase.from("stamps").insert([
      { user_id: matchedChat.user_a, kind: "meetup", label: "In-person meetup completed" },
      { user_id: matchedChat.user_b, kind: "meetup", label: "In-person meetup completed" },
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        chat_id: matchedChat.id,
        new_cap: newCap,
        message: "Envelope unlocked! 20 new messages and passport stamps awarded.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("redeem-meetup-token error:", err);
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
