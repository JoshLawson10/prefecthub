import { Event } from "@/types/database";

export async function createEvent(
  data: Omit<Event, "id" | "created_at" | "updated_at">,
): Promise<Event> {
  return null;
}

export async function updateEvent(
  eventId: string,
  data: Partial<Event>,
): Promise<Event> {
  return null;
}

export async function deleteEvent(eventId: string): Promise<void> {
  return null;
}

export async function duplicateEvent(eventId: string): Promise<Event> {
  return null;
}

export async function updateEventStatus(
  eventId: string,
  status: EventStatus,
): Promise<Event> {
  return null;
}

export async function generateRSVPSlug(eventId: string): Promise<string> {
  return null;
}

export async function sendEventReminder(eventId: string): Promise<void> {
  return null;
}
