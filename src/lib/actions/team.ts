"use server";

import type { EventRole } from "@/types";

export interface AssignTeamMemberInput {
  eventId: string;
  memberId: string;
  role: EventRole;
}

export async function assignTeamMember(input: AssignTeamMemberInput): Promise<void> {
  console.log("[action] assignTeamMember", input);
  // TODO: insert into event_members table
}

export async function removeTeamMember(eventId: string, memberId: string): Promise<void> {
  console.log("[action] removeTeamMember", { eventId, memberId });
  // TODO: delete from event_members where event_id = eventId and member_id = memberId
}

export async function updateTeamMemberRole(
  eventId: string,
  memberId: string,
  role: EventRole,
): Promise<void> {
  console.log("[action] updateTeamMemberRole", { eventId, memberId, role });
  // TODO: update event_members.role where event_id = eventId and member_id = memberId
}
