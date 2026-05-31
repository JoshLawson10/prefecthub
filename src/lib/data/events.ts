import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { Event, EventStats, Filters, Pagination } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";
import { withFilters, withPagination } from "@/lib/utils/database";

export const getWorkspaceEvents = cache(
  async (filters?: Filters, pagination?: Pagination): Promise<Event[]> => {
    const supabase = await createClient();
    const currentUser = await getCurrentUser();
    if (!currentUser?.workspace_id) return [];

    let query = supabase
      .from("events")
      .select("*")
      .eq("workspace_id", currentUser.workspace_id)
      .not("status", "in", '("completed","cancelled")')
      .order("date_start");

    query = withFilters(query, filters);
    query = withPagination(query, pagination);

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching workspace events:", error);
      return [];
    }
    return data;
  },
);

export const getEvents = getWorkspaceEvents;

export const getArchivedEvents = cache(async (): Promise<Event[]> => {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("workspace_id", currentUser.workspace_id)
    .in("status", ["completed", "cancelled"])
    .order("date_start", { ascending: false });

  if (error) {
    console.error("Error fetching archived events:", error);
    return [];
  }
  return data;
});

export const getEvent = cache(
  async (eventId: string): Promise<Event | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
    if (error) return null;
    return data;
  },
);

export const getUpcomingEvents = cache(
  async (limit?: number): Promise<Event[]> => {
    const supabase = await createClient();
    const currentUser = await getCurrentUser();
    if (!currentUser?.workspace_id) return [];

    let query = supabase
      .from("events")
      .select("*")
      .eq("workspace_id", currentUser.workspace_id)
      .eq("status", "upcoming")
      .order("date_start");

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) return [];
    return data;
  },
);

export const getEventsByDateRange = cache(
  async (start: Date, end: Date): Promise<Event[]> => {
    const supabase = await createClient();
    const currentUser = await getCurrentUser();
    if (!currentUser?.workspace_id) return [];

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("workspace_id", currentUser.workspace_id)
      .gte("date_start", start.toISOString())
      .lte("date_start", end.toISOString())
      .order("date_start");

    if (error) return [];
    return data;
  },
);

export const getEventBySlug = cache(
  async (slug: string): Promise<Event | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("rsvp_slug", slug)
      .single();
    if (error) return null;
    return data;
  },
);

export const getEventStats = cache(
  async (eventId: string): Promise<EventStats> => {
    const supabase = await createClient();
    const [tasksRes, rsvpsRes, teamRes] = await Promise.all([
      supabase.from("tasks").select("status").eq("event_id", eventId),
      supabase.from("rsvps").select("guest_count").eq("event_id", eventId),
      supabase
        .from("event_members")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId),
    ]);

    const tasks = tasksRes.data ?? [];
    const rsvps = rsvpsRes.data ?? [];

    return {
      totalRSVPs: rsvps.reduce((sum, r) => sum + r.guest_count, 0),
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === "done").length,
      pendingTasks: tasks.filter((t) => t.status !== "done").length,
      totalMembers: teamRes.count ?? 0,
    };
  },
);

export const getRsvpCount = cache(async (eventId: string): Promise<number> => {
  const supabase = await createClient();
  const { count } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);
  return count ?? 0;
});
