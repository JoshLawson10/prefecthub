"use server";

import { createClient } from "@/lib/supabase/server";
import type { EventRole } from "@/types";

export interface AssignTeamMemberInput {
  eventId: string;
  memberId: string;
  role: EventRole;
}

export async function assignTeamMember(
  input: AssignTeamMemberInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("event_members").insert({
    event_id: input.eventId,
    user_id: input.memberId,
    event_role: input.role,
  });
  if (error) throw new Error(error.message);
}

export async function updateTeamMemberRole(
  eventId: string,
  memberId: string,
  role: EventRole,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_members")
    .update({ event_role: role })
    .eq("event_id", eventId)
    .eq("user_id", memberId);
  if (error) throw new Error(error.message);
}

export async function removeTeamMember(
  eventId: string,
  memberId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("event_members")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", memberId);
  if (error) throw new Error(error.message);
}
