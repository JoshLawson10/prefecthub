import { EventRole } from "@/types/database";

export async function addEventMember(
  eventId: string,
  userId: string,
  role: EventRole,
): Promise<void> {
  return null;
}

export async function removeEventMember(
  eventId: string,
  userId: string,
): Promise<void> {
  return null;
}

export async function updateEventMemberRole(
  eventId: string,
  userId: string,
  role: EventRole,
): Promise<void> {
  return null;
}

export async function bulkAddEventMembers(
  eventId: string,
  userIds: string[],
): Promise<void> {
  return null;
}

export async function assignEventLead(
  eventId: string,
  userId: string,
): Promise<void> {
  return null;
}
