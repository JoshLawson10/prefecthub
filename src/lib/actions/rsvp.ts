import type { RSVP } from "@/types/database";

export async function createRSVP(
  data: Omit<RSVP, "id" | "created_at">,
): Promise<RSVP | null> {
  return null;
}

export async function updateRSVP(
  rsvpId: string,
  data: Partial<RSVP>,
): Promise<RSVP | null> {
  return null;
}

export async function deleteRSVP(rsvpId: string): Promise<null> {
  return null;
}

export async function sendRSVPReminder(eventId: string): Promise<null> {
  return null;
}

export async function exportRSVPToCSV(eventId: string): Promise<string | null> {
  return null;
}

export async function checkInAttendee(rsvpId: string): Promise<null> {
  return null;
}
