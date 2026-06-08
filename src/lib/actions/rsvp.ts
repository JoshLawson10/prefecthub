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

  // Check capacity before inserting
  const { data: event } = await supabase
    .from("events")
    .select("max_capacity")
    .eq("id", input.eventId)
    .single();

  if (event?.max_capacity != null) {
    const { data: existing } = await supabase
      .from("rsvps")
      .select("guest_count")
      .eq("event_id", input.eventId);

    const currentTotal = (existing ?? []).reduce(
      (sum, r) => sum + r.guest_count,
      0,
    );

    if (currentTotal + input.guestCount > event.max_capacity) {
      throw new Error(
        "Sorry, there is not enough capacity remaining for your party size.",
      );
    }
  }

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
