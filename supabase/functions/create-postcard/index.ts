import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

interface CreatePostcardPayload {
  place_id: string;
  caption: string;
  lat: number;
  lng: number;
  accuracy_m?: number;
  image_base64: string;
  demo_mode?: boolean;
}

// Haversine formula in meters
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Strip EXIF metadata from JPEG buffer
function stripJpegExif(buffer: Uint8Array): Uint8Array {
  // Check SOI marker 0xFFD8
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return buffer; // not standard jpeg, return as is
  }
  const cleanChunks: Uint8Array[] = [new Uint8Array([0xff, 0xd8])];
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      cleanChunks.push(buffer.subarray(offset));
      break;
    }
    const marker = buffer[offset + 1];
    // SOS marker (Start of Scan) - rest is compressed image data
    if (marker === 0xda) {
      cleanChunks.push(buffer.subarray(offset));
      break;
    }
    // Skip 0xFF00, standalone markers
    if (marker === 0xd9 || marker === 0x00) {
      cleanChunks.push(buffer.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }
    const length = (buffer[offset + 2] << 8) | buffer[offset + 3];
    const segmentEnd = offset + 2 + length;

    // APP1 marker 0xFFE1 is standard EXIF - skip it
    if (marker === 0xe1) {
      offset = segmentEnd;
      continue;
    }

    cleanChunks.push(buffer.subarray(offset, segmentEnd));
    offset = segmentEnd;
  }

  const totalLen = cleanChunks.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const chunk of cleanChunks) {
    result.set(chunk, pos);
    pos += chunk.length;
  }
  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const allowDemo = (Deno.env.get("ALLOW_DEMO_MODE") || "false").toLowerCase() === "true";

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify JWT
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

    const payload: CreatePostcardPayload = await req.json();
    const { place_id, caption, lat, lng, accuracy_m = 20, image_base64, demo_mode } = payload;

    // Validate caption length (8 to 140 chars)
    if (!caption || caption.trim().length < 8 || caption.trim().length > 140) {
      return new Response(JSON.stringify({ error: "caption_invalid", message: "Caption must be between 8 and 140 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate Image
    if (!image_base64) {
      return new Response(JSON.stringify({ error: "image_invalid", message: "Image is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, "");
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Limit 1.5MB (1.5 * 1024 * 1024 bytes)
    if (imageBytes.length > 1.5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "image_invalid", message: "Image exceeds 1.5MB size limit." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check one postcard per day rule
    const today = new Date().toISOString().split("T")[0];
    const { data: existingPost, error: postCheckErr } = await supabase
      .from("postcards")
      .select("id")
      .eq("author_id", user.id)
      .gte("taken_at", `${today}T00:00:00.000Z`)
      .lte("taken_at", `${today}T23:59:59.999Z`)
      .maybeSingle();

    if (existingPost) {
      return new Response(JSON.stringify({ error: "already_posted_today", message: "Only one postcard per day allowed." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch place
    const { data: place, error: placeErr } = await supabase
      .from("places")
      .select("*")
      .eq("id", place_id)
      .single();

    if (placeErr || !place) {
      return new Response(JSON.stringify({ error: "place_not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Proximity verification
    const isDemo = Boolean(demo_mode && allowDemo);
    if (!isDemo) {
      const distance = calculateHaversineDistance(lat, lng, place.lat, place.lng);
      const allowedRadius = place.radius_m + Math.min(accuracy_m, 50);

      if (distance > allowedRadius) {
        return new Response(
          JSON.stringify({
            error: "not_at_place",
            distance_m: Math.round(distance),
            radius_m: place.radius_m,
            message: `You are ${Math.round(distance)}m away from ${place.name}. Must be within ${place.radius_m}m.`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Strip EXIF
    const sanitizedBytes = stripJpegExif(imageBytes);

    // Upload to private bucket
    const postcardId = crypto.randomUUID();
    const filePath = `${user.id}/${postcardId}.jpg`;
    const { error: uploadErr } = await supabase.storage
      .from("postcards")
      .upload(filePath, sanitizedBytes, { contentType: "image/jpeg", upsert: true });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return new Response(JSON.stringify({ error: "upload_failed", message: uploadErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert postcard
    const { data: newPostcard, error: insertErr } = await supabase
      .from("postcards")
      .insert({
        id: postcardId,
        author_id: user.id,
        place_id: place.id,
        image_path: filePath,
        caption: caption.trim(),
        is_demo: isDemo,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("Postcard insert error:", insertErr);
      return new Response(JSON.stringify({ error: "insert_failed", message: insertErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert Place Stamp for the user
    await supabase.from("stamps").insert({
      user_id: user.id,
      kind: "place",
      label: `Stamped at ${place.name}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        postcard_id: postcardId,
        postcard: newPostcard,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("create-postcard error:", err);
    return new Response(JSON.stringify({ error: "server_error", message: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
