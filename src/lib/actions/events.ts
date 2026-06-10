"use server";

import { createQueryClient } from "@/lib/supabase/query";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/data/users";
import type { EventStatus } from "@/lib/schemas";

export interface CreateEventInput {
  title: string;
  description: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  colour?: string;
  collectRsvps: boolean;
  maxCapacity: number | null;
}

export async function createEvent(input: CreateEventInput): Promise<void> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const [startH, startM] = input.startTime.split(":").map(Number);
  const [endH, endM] = input.endTime.split(":").map(Number);

  const date_start = new Date(input.date);
  date_start.setHours(startH, startM, 0, 0);

  const date_end = new Date(input.date);
  date_end.setHours(endH, endM, 0, 0);

  const slug = input.collectRsvps
    ? `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`
    : null;

  const { error } = await supabase.from("events").insert({
    title: input.title,
    description: input.description,
    date_start: date_start.toISOString(),
    date_end: date_end.toISOString(),
    location: input.location,
    colour: input.colour ?? "#3B82F6",
    max_capacity: input.maxCapacity,
    rsvp_slug: slug,
    created_by: currentUser.id,
    workspace_id: currentUser.workspace_id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function updateEventStatus(
  eventId: string,
  status: EventStatus,
): Promise<void> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("events")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", eventId)
    .eq("workspace_id", currentUser.workspace_id);
  if (error) throw new Error(error.message);
  revalidatePath("/events");
  revalidatePath("/archive");
  revalidatePath("/dashboard");
}

export async function restoreEvent(eventId: string): Promise<void> {
  return updateEventStatus(eventId, "upcoming");
}

export async function archiveEvent(eventId: string): Promise<void> {
  return updateEventStatus(eventId, "completed");
}
