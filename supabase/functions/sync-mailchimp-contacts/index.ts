import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type MailchimpConfig = {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
};

function getMailchimpConfig(): MailchimpConfig {
  const apiKey = Deno.env.get("MAILCHIMP_MARKETING_API_KEY") || "";
  const serverPrefix = Deno.env.get("MAILCHIMP_SERVER_PREFIX") || "";
  const audienceId = Deno.env.get("MAILCHIMP_AUDIENCE_ID") || "";

  if (!apiKey || !serverPrefix || !audienceId) {
    throw new Error(
      "MAILCHIMP_MARKETING_API_KEY, MAILCHIMP_SERVER_PREFIX, and MAILCHIMP_AUDIENCE_ID must all be set as Edge Function secrets."
    );
  }

  return { apiKey, serverPrefix, audienceId };
}

function getBasicAuthHeader(apiKey: string): string {
  // Mailchimp Marketing API uses HTTP Basic auth with any username and the API key as password
  const token = btoa(`anystring:${apiKey}`);
  return `Basic ${token}`;
}

function buildTagsForUser(reminders: any[]): string[] {
  const tags = new Set<string>();

  // Global audience tag so you can segment this app's users in Mailchimp
  tags.add("Inner Chords");

  for (const r of reminders) {
    const classTitle: string =
      r.live_classes?.title || r.class_title || "Unknown Class";
    const minutes: number = r.reminder_minutes_before ?? 0;

    // Tag per class
    tags.add(`Class: ${classTitle}`);

    // Tag per class+reminder time (e.g. "Class: Heart of Nourishment • 15m before")
    if (minutes > 0) {
      tags.add(`Class: ${classTitle} • ${minutes}m before`);
    }
  }

  return Array.from(tags);
}

async function upsertMailchimpMember(
  config: MailchimpConfig,
  email: string,
  name: string | null,
  tags: string[]
) {
  const baseUrl = `https://${config.serverPrefix}.api.mailchimp.com/3.0`;
  const authHeader = getBasicAuthHeader(config.apiKey);

  const emailLower = email.trim().toLowerCase();
  const subscriberHash = createHash("md5").update(emailLower).toString();

  const [firstName, ...rest] = (name || "").split(" ");
  const lastName = rest.join(" ");

  // Upsert the member
  const memberResponse = await fetch(
    `${baseUrl}/lists/${config.audienceId}/members/${subscriberHash}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        email_address: emailLower,
        status_if_new: "subscribed",
        status: "subscribed",
        merge_fields: {
          FNAME: firstName || "",
          LNAME: lastName || "",
        },
      }),
    }
  );

  if (!memberResponse.ok) {
    const text = await memberResponse.text();
    throw new Error(
      `Mailchimp member upsert failed (${memberResponse.status}): ${text}`
    );
  }

  // Apply tags (idempotent – Mailchimp will keep them "active")
  if (tags.length > 0) {
    const tagPayload = {
      tags: tags.map((t) => ({ name: t, status: "active" })),
    };

    const tagResponse = await fetch(
      `${baseUrl}/lists/${config.audienceId}/members/${subscriberHash}/tags`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(tagPayload),
      }
    );

    if (!tagResponse.ok) {
      const text = await tagResponse.text();
      throw new Error(
        `Mailchimp tag update failed (${tagResponse.status}): ${text}`
      );
    }
  }
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed, use POST" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const config = getMailchimpConfig();

    // Optional body: { dryRun?: boolean, limit?: number }
    let dryRun = false;
    let limit: number | null = null;
    try {
      const body = await req.json();
      dryRun = !!body?.dryRun;
      if (typeof body?.limit === "number" && body.limit > 0) {
        limit = body.limit;
      }
    } catch {
      // No body is fine; default to syncing all
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set as Edge Function secrets."
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1) Load all users with email
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, name")
      .not("email", "is", null);

    if (usersError) {
      throw new Error(`Error fetching users: ${usersError.message}`);
    }

    const effectiveUsers = (users || []).filter(
      (u: any) => !!u.email && typeof u.email === "string"
    );
    const totalUsers = effectiveUsers.length;

    // 2) Load all class reminders with joined class info
    const { data: reminders, error: remindersError } = await supabase
      .from("class_reminders")
      .select(
        "id, user_id, reminder_minutes_before, live_class_id, live_classes ( id, title, scheduled_at )"
      );

    if (remindersError) {
      throw new Error(
        `Error fetching class reminders: ${remindersError.message}`
      );
    }

    const remindersByUser = new Map<string, any[]>();
    for (const r of reminders || []) {
      const uid = r.user_id;
      if (!uid) continue;
      if (!remindersByUser.has(uid)) {
        remindersByUser.set(uid, []);
      }
      remindersByUser.get(uid)!.push(r);
    }

    let processed = 0;
    let succeeded = 0;
    const errors: { email: string; message: string }[] = [];

    for (const user of effectiveUsers) {
      if (limit !== null && processed >= limit) break;
      processed++;

      const email: string = user.email;
      const name: string | null = user.name || null;
      const userReminders = remindersByUser.get(user.id) || [];
      const tags = buildTagsForUser(userReminders);

      if (dryRun) {
        continue;
      }

      try {
        await upsertMailchimpMember(config, email, name, tags);
        succeeded++;
      } catch (err: any) {
        errors.push({
          email,
          message: err?.message || String(err),
        });
      }
    }

    const result = {
      success: errors.length === 0,
      dryRun,
      totalUsers,
      processed,
      succeeded,
      failed: errors.length,
      errors,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in sync-mailchimp-contacts:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}


