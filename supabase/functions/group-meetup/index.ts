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

    const { action, code } = await req.json();

    // 1. ACTION: create group meetup code (Host)
    if (action === "create") {
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const groupCode = (100000 + (randomArray[0] % 900000)).toString();
      const codeHash = await sha256(groupCode);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      const { data: group, error: createErr } = await supabase
        .from("group_meetups")
        .insert({
          host_id: user.id,
          code_hash: codeHash,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (createErr) {
        return new Response(JSON.stringify({ error: "create_failed", message: createErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          code: groupCode,
          group_id: group.id,
          expires_at: expiresAt,
          members_needed: 3,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. ACTION: join group meetup code (Member)
    if (action === "join") {
      if (!code || typeof code !== "string" || code.trim().length !== 6) {
        return new Response(JSON.stringify({ error: "invalid_code", message: "6-digit code required." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const codeHash = await sha256(code.trim());

      const { data: group, error: groupErr } = await supabase
        .from("group_meetups")
        .select("*")
        .eq("code_hash", codeHash)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (groupErr || !group) {
        return new Response(JSON.stringify({ error: "invalid_code", message: "Group code not found." }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check expiry
      if (new Date(group.expires_at).getTime() < Date.now()) {
        return new Response(JSON.stringify({ error: "expired", message: "Group code expired." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent host self-joining
      if (group.host_id === user.id) {
        return new Response(JSON.stringify({ error: "host_self_join", message: "You are the host of this group." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Add to group_members
      const { error: joinErr } = await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.id,
      });

      if (joinErr && joinErr.code !== "23505") { // 23505 is unique violation (already joined)
        return new Response(JSON.stringify({ error: "join_failed", message: joinErr.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check total group members count (host + joined members)
      const { data: members } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", group.id);

      const totalCount = 1 + (members ? members.length : 0);

      // If 3 or more members reached: award Group stamp to all!
      if (totalCount >= 3) {
        const allUserIds = [group.host_id, ...(members ? members.map((m: any) => m.user_id) : [])];
        const stampInserts = allUserIds.map((uid: string) => ({
          user_id: uid,
          kind: "group",
          label: "Group Meetup (3+ members) completed",
        }));

        await supabase.from("stamps").insert(stampInserts);
      }

      return new Response(
        JSON.stringify({
          success: true,
          total_members: totalCount,
          unlocked: totalCount >= 3,
          message: totalCount >= 3
            ? "Group unlocked! 3+ members gathered. Group stamp awarded to everyone!"
            : `Joined group! (${totalCount}/3 needed).`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "invalid_action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("group-meetup error:", err);
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
