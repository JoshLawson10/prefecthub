import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { User, Event, EventRole } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

export async function getEventMembers(
  eventId: string,
): Promise<(User & { event_role: EventRole })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_members")
    .select("event_role, user:users(*)")
    .eq("event_id", eventId);

  if (error) {
    console.error("Error fetching event members:", error);
    return [];
  }

  return (data as unknown as { event_role: EventRole; user: User }[]).map(
    (item) => ({
      ...item.user,
      event_role: item.event_role,
    }),
  );
}

export const getTeamByEvent = getEventMembers;

export async function getUserEvents(userId?: string): Promise<Event[]> {
  const supabase = await createClient();
  const targetId = userId ?? (await getCurrentUser())?.id;
  if (!targetId) return [];

  const { data, error } = await supabase
    .from("event_members")
    .select("event:events(*)")
    .eq("user_id", targetId);

  if (error) {
    console.error("Error fetching user events:", error);
    return [];
  }

  return (data as unknown as { event: Event | null }[])
    .map((item) => item.event)
    .filter((event): event is Event => event !== null);
}

export const checkUserInEvent = cache(
  async (eventId: string, userId?: string): Promise<boolean> => {
    const supabase = await createClient();
    const targetId = userId ?? (await getCurrentUser())?.id;
    if (!targetId) return false;

    const { count, error } = await supabase
      .from("event_members")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("user_id", targetId);

    if (error) return false;
    return (count ?? 0) > 0;
  },
);

export const getEventLead = cache(
  async (eventId: string): Promise<User | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("event_members")
      .select("user:users(*)")
      .eq("event_id", eventId)
      .eq("event_role", "lead")
      .maybeSingle();

    if (error || !data) return null;
    return (data as unknown as { user: User | null }).user ?? null;
  },
);
