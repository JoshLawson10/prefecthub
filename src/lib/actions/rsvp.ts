"use server";

import { createClient } from "@/lib/supabase/server";

export interface SubmitRsvpInput {
  eventId: string;
  name: string;
  email: string;
  guestCount: number;
  dietaryNotes: string | null;
}

export async function submitRsvp(input: SubmitRsvpInput): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("rsvps").insert({
    event_id: input.eventId,
    name: input.name,
    email: input.email,
    guest_count: input.guestCount,
    dietary_notes: input.dietaryNotes,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("This email has already RSVPed for this event.");
    }
    throw new Error(error.message);
  }
}
