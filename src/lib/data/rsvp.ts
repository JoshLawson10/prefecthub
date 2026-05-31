import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { RSVP, RSVPStats } from "@/lib/schemas";

export const getRsvp = cache(async (rsvpId: string): Promise<RSVP | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("id", rsvpId)
    .single();
  if (error) return null;
  return {
    ...data,
    created_at: new Date(data.created_at),
  };
});

export async function getEventRsvps(eventId: string): Promise<RSVP[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event RSVPs:", error);
    return [];
  }
  return data.map((r) => ({ ...r, created_at: new Date(r.created_at) }));
}

export const getRsvpByEmail = cache(
  async (eventId: string, email: string): Promise<RSVP | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .eq("event_id", eventId)
      .eq("email", email)
      .maybeSingle();
    if (error || !data) return null;
    return { ...data, created_at: new Date(data.created_at) };
  },
);

export async function getRsvpStats(eventId: string): Promise<RSVPStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rsvps")
    .select("guest_count, dietary_notes")
    .eq("event_id", eventId);

  if (error || !data || data.length === 0) {
    return {
      total: 0,
      totalGuests: 0,
      averageGuestsPerRSVP: 0,
      withDietaryRestrictions: 0,
    };
  }

  const total = data.length;
  const totalGuests = data.reduce((sum, r) => sum + r.guest_count, 0);
  const withDietary = data.filter(
    (r) => r.dietary_notes && r.dietary_notes.trim().length > 0,
  ).length;

  return {
    total,
    totalGuests,
    averageGuestsPerRSVP: total > 0 ? totalGuests / total : 0,
    withDietaryRestrictions: withDietary,
  };
}

export async function getRsvpCount(eventId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);
  return count ?? 0;
}
