"use server";

export interface SubmitRsvpInput {
  eventId: string;
  name: string;
  email: string;
  guestCount: number;
  dietaryNotes: string | null;
}

export async function submitRsvp(input: SubmitRsvpInput): Promise<void> {
  console.log("[action] submitRsvp", input);
  // TODO: insert into rsvps table
}
