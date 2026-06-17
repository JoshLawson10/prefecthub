import { cache } from "react";
import type { DashboardStats, Activity } from "@/lib/schemas";
import { getCurrentUser, getWorkspaceMembers } from "@/lib/data/users";
import { getWorkspaceEvents, getArchivedEvents } from "@/lib/data/events";
import { getTasks } from "@/lib/data/tasks";
import { createQueryClient } from "@/lib/supabase/query";

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) {
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      totalRSVPs: 0,
      pendingRSVPs: 0,
      totalMembers: 0,
      activeMembers: 0,
    };
  }

  const [activeEvents, archivedEvents, tasks, members, rsvpsRes] =
    await Promise.all([
      getWorkspaceEvents(),
      getArchivedEvents(),
      getTasks(),
      getWorkspaceMembers(),
      supabase
        .from("rsvps")
        .select("id, event_id, event:events!inner(workspace_id)")
        .eq("event.workspace_id", currentUser.workspace_id),
    ]);

  const upcomingEvents = activeEvents.filter((e) => e.status === "upcoming");
  const allEvents = [...activeEvents, ...archivedEvents];
  const completedTasks = tasks.filter((t) => t.status === "done");
  const overdueTasks = tasks.filter((t) => t.status === "overdue");
  const allRsvps = rsvpsRes.data ?? [];

  const assignedUserIds = new Set(
    tasks.map((t) => t.assigned_to).filter(Boolean),
  );
  const activeMembers = members.filter((m) => assignedUserIds.has(m.id));

  return {
    totalEvents: allEvents.length,
    upcomingEvents: upcomingEvents.length,
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    overdueTasks: overdueTasks.length,
    totalRSVPs: allRsvps.length,
    pendingRSVPs: upcomingEvents.length,
    totalMembers: members.length,
    activeMembers: activeMembers.length,
  };
});

export async function getRecentActivity(limit = 10): Promise<Activity[]> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const { data: members } = await supabase
    .from("users")
    .select("id")
    .eq("workspace_id", currentUser.workspace_id);

  const memberIds = (members ?? []).map((m) => m.id);
  if (memberIds.length === 0) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      user:users!user_id(*),
      event:events(*)
    `,
    )
    .in("user_id", memberIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }

  return (data ?? [])
    .filter((n) => n.user)
    .map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description ?? "",
      created_at: new Date(n.created_at),
      user: {
        ...n.user,
        created_at: new Date(n.user.created_at),
        updated_at: new Date(n.user.updated_at),
      },
      event: n.event
        ? {
            ...n.event,
            date_start: new Date(n.event.date_start),
            date_end: new Date(n.event.date_end),
            created_at: new Date(n.event.created_at),
            updated_at: new Date(n.event.updated_at),
          }
        : undefined,
    }));
}

export async function getEventActivityFeed(
  eventId: string,
  limit = 20,
): Promise<Activity[]> {
  const supabase = createQueryClient();

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      user:users!user_id(*),
      event:events(*)
    `,
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching event activity:", error);
    return [];
  }

  return (data ?? [])
    .filter((n) => n.user)
    .map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description ?? "",
      created_at: new Date(n.created_at),
      user: {
        ...n.user,
        created_at: new Date(n.user.created_at),
        updated_at: new Date(n.user.updated_at),
      },
      event: n.event
        ? {
            ...n.event,
            date_start: new Date(n.event.date_start),
            date_end: new Date(n.event.date_end),
            created_at: new Date(n.event.created_at),
            updated_at: new Date(n.event.updated_at),
          }
        : undefined,
    }));
}
