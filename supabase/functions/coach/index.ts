import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

interface CoachRequest {
  action: "chat" | "summary";
  message?: string;
}

const FALLBACK_EXPERIMENTS: Record<string, string> = {
  scroll:
    "Let's try a small experiment. Put your phone in another room 30 minutes before sleep for the next five nights. You will feel the difference in the morning.",
  read:
    "Let's try a small experiment. Read five pages of a printed book every evening for seven days. You don't need to share it with anyone.",
  friend:
    "Reach out to someone you haven't spoken to in a while with a short voice call or handwritten note this weekend. Keep it simple and unhurried.",
  lonely:
    "Take a slow 15-minute walk tomorrow afternoon to your nearest library or park bench and simply sit quietly among other people.",
  bored:
    "Spend ten minutes with a pencil and scrap paper sketching anything on your desk without looking at your screen.",
  default:
    "Let's try a gentle experiment. Leave your phone on silent on your desk during your next meal and simply notice the taste of your food.",
};

function getRuleBasedFallback(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, reply] of Object.entries(FALLBACK_EXPERIMENTS)) {
    if (key !== "default" && lower.includes(key)) {
      return reply;
    }
  }
  return FALLBACK_EXPERIMENTS.default;
}

// Multi-provider AI Caller (Groq / Gemini / OpenRouter / Anthropic)
async function callAIWithTimeout(
  systemPrompt: string,
  userMessage: string,
  timeoutMs = 8000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const groqKey = Deno.env.get("GROQ_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    // 1. Try Groq (Ultra-fast inference ~400 tok/s)
    if (groqKey) {
      const model = Deno.env.get("GROQ_MODEL") || "llama-3.3-70b-versatile";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 300,
          temperature: 0.6,
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    }

    // 2. Try Gemini
    if (geminiKey) {
      const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.6 },
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    }

    // 3. Try OpenRouter
    if (openRouterKey) {
      const model = Deno.env.get("OPENROUTER_MODEL") || "meta-llama/llama-3.3-70b-instruct:free";
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          max_tokens: 300,
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    }

    // 4. Try Anthropic Claude
    if (anthropicKey) {
      const model = Deno.env.get("COACH_MODEL") || "claude-3-haiku-20240307";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
        }),
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text;
        if (text) return text.trim();
      }
    }

    throw new Error("No AI provider available or configured.");
  } finally {
    clearTimeout(timer);
  }
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

    const payload: CoachRequest = await req.json();
    const { action = "chat", message = "" } = payload;

    // Build Server-side Context for User
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().split("T")[0];

    const [questRes, stampsRes, meetupsRes] = await Promise.all([
      supabase.from("quest_logs").select("id", { count: "exact" }).eq("user_id", user.id).gte("created_at", sevenDaysAgo),
      supabase.from("stamps").select("id, kind, label", { count: "exact" }).eq("user_id", user.id).gte("created_at", sevenDaysAgo),
      supabase.from("meetups").select("id", { count: "exact" }).gte("met_at", sevenDaysAgo),
    ]);

    const daysDoneLast7 = questRes.count || 0;
    const stampsLast7 = stampsRes.count || 0;
    const meetupsLast7 = meetupsRes.count || 0;

    // Handle ACTION = "summary"
    if (action === "summary") {
      const weekStart = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const summaryText =
        `Hereabouts Weekly Letter\nWeek of ${weekStart}\n\n` +
        `What you did: You logged ${daysDoneLast7} quests this week.\n` +
        `What you collected: ${stampsLast7} passport stamps earned through real offline moments.\n` +
        `Who you met: ${meetupsLast7} in-person meetups completed.\n\n` +
        `One quiet thought for next week: Keep leaving the phone behind when stepping outside. Small habits anchor deep calm.`;

      await supabase.from("coach_summaries").upsert({
        user_id: user.id,
        week_start: weekStart,
        summary: summaryText,
      });

      return new Response(
        JSON.stringify({
          success: true,
          summary: summaryText,
          stats: { daysDoneLast7, stampsLast7, meetupsLast7 },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle ACTION = "chat"
    if (!message || message.trim().length === 0 || message.trim().length > 500) {
      return new Response(
        JSON.stringify({ error: "invalid_message", message: "Message must be between 1 and 500 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit: max 3 user messages per day
    const { count: userMsgsToday } = await supabase
      .from("coach_messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("role", "user")
      .gte("created_at", `${today}T00:00:00.000Z`);

    if (userMsgsToday && userMsgsToday >= 3) {
      return new Response(
        JSON.stringify({
          error: "daily_limit_reached",
          message: "You have used your 3 coach check-ins for today. Come back tomorrow.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Construct Coach System Prompt
    let systemPrompt = `You are the Hereabouts Life Coach, a calm, kind guide.
Rules:
- Reply in 3 sentences or fewer.
- Propose ONE small offline experiment lasting up to 7 days.
- Never recommend content to consume (no videos, accounts, apps, shows, feeds, podcasts).
- Never shame the user. If they missed days, make the goal smaller.
- Do not ask more than one question.
- If the user seems in distress, be gentle and suggest talking to someone they trust.
- Stay private: never suggest posting or sharing the experiment.
- The goal is to make the coach less needed over time; encourage doing the experiment without the app.
- You have no access to phone screen time data. State this plainly if asked.

Context: In the last 7 days, the user completed ${daysDoneLast7} quests and earned ${stampsLast7} stamps.`;

    if (daysDoneLast7 <= 3) {
      systemPrompt += ` The user completed few days. Make the experiment smaller than usual and never scold.`;
    }

    // Log user message
    await supabase.from("coach_messages").insert({
      user_id: user.id,
      role: "user",
      content: message.trim(),
      source: "ai",
    });

    let replyText = "";
    let source: "ai" | "fallback" = "ai";

    try {
      replyText = await callAIWithTimeout(systemPrompt, message.trim(), 8000);
    } catch (aiErr) {
      console.warn("AI failed or timed out, using rule-based fallback:", aiErr);
      replyText = getRuleBasedFallback(message);
      source = "fallback";
    }

    // Log assistant response
    await supabase.from("coach_messages").insert({
      user_id: user.id,
      role: "assistant",
      content: replyText,
      source,
    });

    return new Response(
      JSON.stringify({
        reply: replyText,
        source,
        remaining_today: Math.max(0, 3 - (userMsgsToday || 0) - 1),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("coach error:", err);
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
