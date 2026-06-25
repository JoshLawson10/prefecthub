#!/usr/bin/env node
// scripts/seed.mjs
// Seeds PrefectHub with an initial workspace + admin user.
// Safe to re-run (idempotent).
//
// Usage:
//   node scripts/seed.mjs
//
// Override via env vars:
//   SEED_EMAIL / SEED_PASSWORD / SEED_NAME / SEED_WORKSPACE / SEED_SCHOOL

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------
// Load .env
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

try {
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("Could not read .env file.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const SEED_EMAIL = process.env.SEED_EMAIL || "admin@prefecthub.dev";
const SEED_PASSWORD = process.env.SEED_PASSWORD || "Password123!";
const SEED_NAME = process.env.SEED_NAME || "Admin User";
const SEED_WORKSPACE = process.env.SEED_WORKSPACE || "Prefect Hub";
const SEED_SCHOOL = process.env.SEED_SCHOOL || "Cumberland High School";
const SEED_YEAR = new Date().getFullYear();

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function isoDate(offsetDays = 0, offsetHours = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(d.getHours() + offsetHours);
  return d.toISOString();
}

function localDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

async function step(label, fn) {
  process.stdout.write("  " + label + "... ");
  try {
    const result = await fn();
    console.log("done");
    return result;
  } catch (err) {
    console.log("FAILED");
    console.error("    " + err.message);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
console.log("");
console.log("PrefectHub database seed");
console.log("=========================");
console.log("  Supabase URL : " + SUPABASE_URL);
console.log("  Email        : " + SEED_EMAIL);
console.log("  Name         : " + SEED_NAME);
console.log(
  "  Workspace    : " +
    SEED_WORKSPACE +
    " (" +
    SEED_SCHOOL +
    ", " +
    SEED_YEAR +
    ")",
);
console.log("");

// 1. Auth user
let authUserId;
await step("Create auth user", async () => {
  const { data, error } = await admin.auth.admin.createUser({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: SEED_NAME },
  });

  if (error) {
    if (
      error.message.includes("already been registered") ||
      error.message.toLowerCase().includes("already exists")
    ) {
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === SEED_EMAIL);
      if (!existing)
        throw new Error("User exists but could not be found: " + error.message);
      authUserId = existing.id;
      process.stdout.write("(already exists, skipping) ");
      return;
    }
    throw error;
  }
  authUserId = data.user.id;
});

// 2. Workspace
let workspaceId;
await step("Create workspace", async () => {
  const { data: existing } = await admin
    .from("workspaces")
    .select("id")
    .eq("created_by", authUserId)
    .maybeSingle();

  if (existing) {
    workspaceId = existing.id;
    process.stdout.write("(already exists, skipping) ");
    return;
  }

  const { data, error } = await admin
    .from("workspaces")
    .insert({
      name: SEED_WORKSPACE,
      school: SEED_SCHOOL,
      year: SEED_YEAR,
      created_by: authUserId,
    })
    .select("id")
    .single();

  if (error) throw error;
  workspaceId = data.id;
});

// 3. User profile
await step("Create user profile", async () => {
  const { data: existing } = await admin
    .from("users")
    .select("id")
    .eq("id", authUserId)
    .maybeSingle();

  if (existing) {
    process.stdout.write("(already exists, skipping) ");
    return;
  }

  const { error } = await admin.from("users").insert({
    id: authUserId,
    email: SEED_EMAIL,
    full_name: SEED_NAME,
    initials: initials(SEED_NAME),
    workspace_id: workspaceId,
    role: "admin",
  });

  if (error) throw error;
});

// 4. Sample event
let eventId;
await step("Create sample event", async () => {
  const { data: existing } = await admin
    .from("events")
    .select("id")
    .eq("workspace_id", workspaceId)
    .limit(1)
    .maybeSingle();

  if (existing) {
    eventId = existing.id;
    process.stdout.write("(already exists, skipping) ");
    return;
  }

  const { data, error } = await admin
    .from("events")
    .insert({
      title: "Year 12 Graduation Ceremony",
      description:
        "Annual graduation ceremony for the Year 12 cohort. All prefects are required to assist with guest management and venue setup.",
      date_start: isoDate(14),
      date_end: isoDate(14, 2),
      location: "School Hall",
      status: "upcoming",
      colour: "#6366F1",
      max_capacity: 300,
      created_by: authUserId,
      workspace_id: workspaceId,
    })
    .select("id")
    .single();

  if (error) throw error;
  eventId = data.id;
});

// 5. Event lead
await step("Assign event lead", async () => {
  const { data: existing } = await admin
    .from("event_members")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", authUserId)
    .maybeSingle();

  if (existing) {
    process.stdout.write("(already exists, skipping) ");
    return;
  }

  const { error } = await admin
    .from("event_members")
    .insert({ event_id: eventId, user_id: authUserId, event_role: "lead" });

  if (error) throw error;
});

// 6. Sample tasks
await step("Create sample tasks", async () => {
  const { data: existing } = await admin
    .from("tasks")
    .select("id")
    .eq("event_id", eventId)
    .limit(1)
    .maybeSingle();

  if (existing) {
    process.stdout.write("(already exists, skipping) ");
    return;
  }

  const { error } = await admin.from("tasks").insert([
    {
      title: "Confirm venue booking with admin office",
      description:
        "Email the admin office to confirm the hall booking and AV setup requirements.",
      priority: "high",
      status: "todo",
      due_date: localDate(3),
      assigned_to: authUserId,
      created_by: authUserId,
      event_id: eventId,
      workspace_id: workspaceId,
    },
    {
      title: "Prepare guest seating plan",
      description:
        "Create a seating plan using the RSVP data once registration closes.",
      priority: "medium",
      status: "todo",
      due_date: localDate(10),
      assigned_to: authUserId,
      created_by: authUserId,
      event_id: eventId,
      workspace_id: workspaceId,
    },
    {
      title: "Brief prefect volunteers on door duties",
      description:
        "Run a 15-minute briefing with all rostered prefects on arrival procedures.",
      priority: "medium",
      status: "todo",
      due_date: localDate(12),
      assigned_to: authUserId,
      created_by: authUserId,
      event_id: eventId,
      workspace_id: workspaceId,
    },
  ]);

  if (error) throw error;
});

// 7. Welcome notification
await step("Create welcome notification", async () => {
  const { data: existing } = await admin
    .from("notifications")
    .select("id")
    .eq("user_id", authUserId)
    .eq("type", "member_added")
    .maybeSingle();

  if (existing) {
    process.stdout.write("(already exists, skipping) ");
    return;
  }

  const { error } = await admin.from("notifications").insert({
    user_id: authUserId,
    type: "member_added",
    title: "Welcome to PrefectHub!",
    description:
      "Your workspace is set up. Start by exploring the dashboard or creating your first event.",
    action_label: "Go to Dashboard",
    action_href: "/dashboard",
  });

  if (error) throw error;
});

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------
console.log("");
console.log("Seed complete!");
console.log("--------------");
console.log("  Email    : " + SEED_EMAIL);
console.log("  Password : " + SEED_PASSWORD);
console.log("  Role     : admin");
console.log("");
console.log("Visit http://localhost:3000/login to sign in.");
console.log("");
