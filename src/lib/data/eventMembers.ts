import { User, Event, EventRole } from "@/types/database";

export async function getEventMembers(
  eventId: string,
): Promise<(User & { event_role: EventRole })[]> {
  return null;
}

export async function getUserEvents(userId?: string): Promise<Event[]> {
  return null;
}

export async function checkUserInEvent(
  eventId: string,
  userId?: string,
): Promise<boolean> {
  return null;
}

export async function getEventLead(eventId: string): Promise<User | null> {
  return null;
}
