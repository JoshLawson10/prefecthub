import { createQueryClient } from "@/lib/supabase/query";
import { cache } from "react";
import type { Task, Filters, TaskStatus, TaskStats } from "@/lib/schemas";
import { withFilters, withPagination } from "@/lib/utils/database";
import { getCurrentUser } from "@/lib/data/users";
import type { Pagination } from "@/lib/schemas";

export const getTask = cache(async (taskId: string): Promise<Task | null> => {
  const supabase = createQueryClient();
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "*, assigned_user:users!assigned_to(full_name, initials), event:events(title)",
    )
    .eq("id", taskId)
    .single();
  if (error) return null;
  return data;
});

export async function getEventTasks(
  eventId: string,
  filters?: Filters,
  pagination?: Pagination,
): Promise<Task[]> {
  const supabase = createQueryClient();

  let query = supabase
    .from("tasks")
    .select(
      "*, assigned_user:users!assigned_to(full_name, initials), event:events(title)",
    )
    .eq("event_id", eventId)
    .order("due_date", { ascending: true, nullsFirst: false });

  query = withFilters(query, filters);
  query = withPagination(query, pagination);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching event tasks:", error);
    return [];
  }
  return data;
}

export const getTasksByEvent = getEventTasks;

export async function getUserTasks(status?: TaskStatus[]): Promise<Task[]> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  let query = supabase
    .from("tasks")
    .select(
      "*, assigned_user:users!assigned_to(full_name, initials), event:events(title)",
    )
    .eq("assigned_to", currentUser.id)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching user tasks:", error);
    return [];
  }
  return data;
}

export async function getTasks(filters?: Filters): Promise<Task[]> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  let query = supabase
    .from("tasks")
    .select(
      "*, assigned_user:users!assigned_to(full_name, initials), event:events(title)",
    )
    .eq("workspace_id", currentUser.workspace_id)
    .order("due_date", { ascending: true, nullsFirst: false });

  query = withFilters(query, filters);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
  return data;
}

export async function getOverdueTasks(): Promise<Task[]> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "*, assigned_user:users!assigned_to(full_name, initials), event:events(title)",
    )
    .eq("assigned_to", currentUser.id)
    .eq("status", "overdue")
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching overdue tasks:", error);
    return [];
  }
  return data;
}

export async function getTasksDueSoon(days: number): Promise<Task[]> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "*, assigned_user:users!assigned_to(full_name, initials), event:events(title)",
    )
    .eq("assigned_to", currentUser.id)
    .in("status", ["todo", "in_progress"])
    .gte("due_date", now.toISOString().split("T")[0])
    .lte("due_date", future.toISOString().split("T")[0])
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching tasks due soon:", error);
    return [];
  }
  return data;
}

export async function getTaskStats(eventId: string): Promise<TaskStats> {
  const supabase = createQueryClient();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("status, priority")
    .eq("event_id", eventId);

  const stats: TaskStats = {
    total: tasks?.length ?? 0,
    todo: 0,
    in_progress: 0,
    overdue: 0,
    done: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
  };

  tasks?.forEach((t) => {
    if (t.status in stats)
      (stats as unknown as Record<string, number>)[t.status]++;
    if (t.priority === "high") stats.byPriority.high++;
    if (t.priority === "medium") stats.byPriority.medium++;
    if (t.priority === "low") stats.byPriority.low++;
  });

  return stats;
}
