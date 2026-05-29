import type { RSVP, RSVPStats } from "@/types/database";

export async function getRSVP(rsvpId: string): Promise<RSVP | null> {
  return null;
}

export async function getEventRSVPs(eventId: string): Promise<RSVP[] | null> {
  return null;
}

export async function getRSVPBySlug(
  slug: string,
  eventId: string,
): Promise<RSVP | null> {
  return null;
}

export async function getRSVPStats(eventId: string): Promise<RSVPStats | null> {
  return null;
}

export async function checkRSVPExists(
  eventId: string,
  email: string,
): Promise<boolean | null> {
  return null;
}
