"use server";

import { createQueryClient } from "@/lib/supabase/query";
import type { EventRole } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function addEventMember(
  eventId: string,
  userId: string,
  role: EventRole = "member",
): Promise<void> {
  const supabase = createQueryClient();

  const { error } = await supabase.from("event_members").insert({
    event_id: eventId,
    user_id: userId,
    event_role: role,
  });

  if (error) throw new Error(`Failed to add event member: ${error.message}`);

  revalidatePath(`/events/${eventId}`);
}

export async function removeEventMember(
  eventId: string,
  userId: string,
): Promise<void> {
  const supabase = createQueryClient();

  const { error } = await supabase
    .from("event_members")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to remove event member: ${error.message}`);

  revalidatePath(`/events/${eventId}`);
}

export async function updateEventMemberRole(
  eventId: string,
  userId: string,
  role: EventRole,
): Promise<void> {
  const supabase = createQueryClient();

  const { error } = await supabase
    .from("event_members")
    .update({ event_role: role })
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error)
    throw new Error(`Failed to update event member role: ${error.message}`);

  revalidatePath(`/events/${eventId}`);
}

export async function bulkAddEventMembers(
  eventId: string,
  userIds: string[],
): Promise<void> {
  const supabase = createQueryClient();

  const members = userIds.map((userId) => ({
    event_id: eventId,
    user_id: userId,
    event_role: "member" as EventRole,
  }));

  const { error } = await supabase.from("event_members").insert(members);

  if (error) throw new Error(`Failed to add event members: ${error.message}`);

  revalidatePath(`/events/${eventId}`);
}

export async function assignEventLead(
  eventId: string,
  userId: string,
): Promise<void> {
  const supabase = createQueryClient();

  await supabase
    .from("event_members")
    .update({ event_role: "member" })
    .eq("event_id", eventId)
    .eq("event_role", "lead");

  const { error } = await supabase
    .from("event_members")
    .update({ event_role: "lead" })
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to assign event lead: ${error.message}`);

  revalidatePath(`/events/${eventId}`);
}
