import type { DashboardStats, Activity, Task } from "@/types/database";

export async function getDashboardStats(): Promise<DashboardStats | null> {
  return null;
}

export async function getRecentActivity(
  limit?: number,
): Promise<Activity[] | null> {
  return null;
}

export async function getUserActivity(
  days?: number,
): Promise<Activity[] | null> {
  return null;
}

export async function getUpcomingDeadlines(
  days?: number,
): Promise<Task[] | null> {
  return null;
}
